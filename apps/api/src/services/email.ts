import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

export const send2FACode = async (email: string, code: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #f8fafc;">
      <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e293b; font-size: 24px; margin: 0;">FicoBridge</h1>
          <p style="color: #64748b; margin-top: 8px;">Sécurité de niveau professionnel</p>
        </div>
        <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 16px;">Code de vérification</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
          Voici votre code de vérification à deux facteurs. Ce code expirera dans 5 minutes.
        </p>
        <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f172a;">${code}</span>
        </div>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
          Si vous n'avez pas tenté de vous connecter, ignorez cet email ou contactez immédiatement le support.
        </p>
      </div>
    </div>
  `;
  await sendEmail(email, 'FicoBridge - Code de vérification', html);
};

export const sendNotification = async (email: string, title: string, message: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #f8fafc;">
      <div style="background: white; border-radius: 16px; padding: 40px;">
        <h2 style="color: #1e293b;">${title}</h2>
        <p style="color: #475569; line-height: 1.6;">${message}</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Accéder à FicoBridge</a>
      </div>
    </div>
  `;
  await sendEmail(email, `FicoBridge - ${title}`, html);
};
