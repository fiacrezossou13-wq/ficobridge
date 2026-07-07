import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { send2FACode } from '../services/email';
import { logger } from '../utils/logger';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const verify2FASchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

const twoFACodes = new Map<string, { code: string; expiresAt: Date; attempts: number }>();
const MAX_2FA_ATTEMPTS = 3;
const CODE_EXPIRY_MINUTES = 5;

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
    const twoFASecret = speakeasy.generateSecret({ length: 32 });

    const user = await prisma.user.create({
      data: {
        email, password: hashedPassword, firstName, lastName,
        twoFASecret: twoFASecret.base32, twoFAEnabled: true,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ message: 'Registration successful', user });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError('Account temporarily locked. Try again later.', 403);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const newAttempts = user.loginAttempts + 1;
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
      if (newAttempts >= maxAttempts) {
        const lockTime = new Date(Date.now() + parseInt(process.env.LOCK_TIME_MINUTES || '30') * 60000);
        await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: newAttempts, lockedUntil: lockTime } });
        throw new AppError('Account locked due to too many failed attempts', 403);
      }
      await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: newAttempts } });
      throw new AppError('Invalid credentials', 401);
    }

    await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, lockedUntil: null } });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    twoFACodes.set(email, { code, expiresAt: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60000), attempts: 0 });
    await send2FACode(email, code);

    logger.info(`2FA code sent to ${email}`);
    res.json({ message: 'Verification code sent', requires2FA: true, email, expiresIn: CODE_EXPIRY_MINUTES * 60 });
  } catch (error) { next(error); }
});

router.post('/verify-2fa', async (req, res, next) => {
  try {
    const { email, code } = verify2FASchema.parse(req.body);
    const storedData = twoFACodes.get(email);
    if (!storedData) throw new AppError('No verification code found. Please login again.', 400);
    if (storedData.expiresAt < new Date()) { twoFACodes.delete(email); throw new AppError('Verification code expired', 400); }
    if (storedData.attempts >= MAX_2FA_ATTEMPTS) { twoFACodes.delete(email); throw new AppError('Too many failed attempts', 403); }
    if (storedData.code !== code) {
      storedData.attempts += 1; twoFACodes.set(email, storedData);
      throw new AppError('Invalid verification code', 401);
    }

    twoFACodes.delete(email);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('User not found', 404);

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' });

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await prisma.activityLog.create({
      data: { userId: user.id, action: 'LOGIN', ip: req.ip, userAgent: req.headers['user-agent'] },
    });

    logger.info(`User logged in: ${email}`);
    res.json({ token, refreshToken, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (error) { next(error); }
});

router.post('/resend-2fa', async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('User not found', 404);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    twoFACodes.set(email, { code, expiresAt: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60000), attempts: 0 });
    await send2FACode(email, code);
    res.json({ message: 'New verification code sent', expiresIn: CODE_EXPIRY_MINUTES * 60 });
  } catch (error) { next(error); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) throw new AppError('Invalid refresh token', 401);
    const newToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token: newToken });
  } catch (error) { next(error); }
});

router.post('/logout', async (req, res, next) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) { next(error); }
});

export { router as authRouter };
