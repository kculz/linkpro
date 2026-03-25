import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import logger from '@utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const TEMPLATES_DIR = path.resolve('src', 'templates', 'emails');

const transporter = nodemailer.createTransport({
  service: !process.env.SMTP_HOST ? 'gmail' : undefined, // Better defaults for Gmail
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps with some self-signed or proxy issues
  },
  connectionTimeout: 10000, // 10s
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

/**
 * Renders a Handlebars template from /templates/emails/<name>.hbs
 */
const renderTemplate = (templateName: string, context: Record<string, unknown>): string => {
  const filePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const compiled = Handlebars.compile(source);
  return compiled({ ...context, year: new Date().getFullYear() });
};

interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

export const sendEmail = async ({ to, subject, template, context }: SendEmailOptions): Promise<void> => {
  try {
    const html = renderTemplate(template, context);
    await transporter.sendMail({
      from: `"LinkPro" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent [${template}] → ${to}`);
  } catch (err) {
    logger.error(`Failed to send email [${template}] → ${to}: ${err}`);
    throw err;
  }
};

// Convenience wrappers
export const sendOtpEmail = (email: string, otp: string, name?: string) =>
  sendEmail({ 
    to: email, 
    subject: 'Your LinkPro Verification Code', 
    template: 'otp', 
    context: { otp, name: name || 'Property Owner' } 
  });
export const sendWelcomeEmail = (email: string, name: string, role: string) =>
  sendEmail({
    to: email,
    subject: 'Welcome to LinkPro!',
    template: 'welcome',
    context: { name, role, loginUrl: `${process.env.CLIENT_URL}/login` },
  });

export const sendPasswordResetEmail = (email: string, name: string, resetUrl: string) =>
  sendEmail({ to: email, subject: 'Reset your LinkPro password', template: 'password-reset', context: { name, resetUrl } });
