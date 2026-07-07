import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AppError } from './errorHandler';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;
    if (!token) throw new AppError('Authentication required', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true, lockedUntil: true },
    });

    if (!user || !user.isActive) throw new AppError('User not found or inactive', 401);
    if (user.lockedUntil && user.lockedUntil > new Date()) throw new AppError('Account temporarily locked', 403);

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid or expired token', 401);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
};
