import { v4 as uuidv4 } from 'uuid';
import User from '@models/User.js';
import { hashPassword, comparePasswords } from '@utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@utils/jwt.js';
import { generateOtp, verifyOtp } from '@services/otp.service.js';
import { sendOtpEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@config/mailer.js';
import { AppError } from '@middlewares/errorHandler.js';
import redisClient from '@config/redis.js';
import logger from '@utils/logger.js';

const RESET_TOKEN_EXPIRY = 15 * 60; // 15 minutes

import sequelize from '@config/database.js';

// ─── Register ────────────────────────────────────────────────────────────────

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}) => {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw new AppError('Email already registered', 409);

  const hashedPassword = await hashPassword(data.password);

  return await sequelize.transaction(async (t) => {
    const user = await User.create(
      {
        ...data,
        password: hashedPassword,
        role: 'CLIENT',
        isVerified: false,
      },
      { transaction: t }
    );

    const otp = await generateOtp(user.email);
    await sendOtpEmail(user.email, otp, user.name);
    
    logger.info(`New user registered: ${user.email} [${user.role}]`);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  });
};

// ─── OTP: Send ───────────────────────────────────────────────────────────────

export const sendOtp = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError('User not found', 404);
  const otp = await generateOtp(email);
  await sendOtpEmail(email, otp, user.name);
};

// ─── OTP: Verify Email ────────────────────────────────────────────────────────

export const verifyUserOtp = async (email: string, otp: string) => {
  const isValid = await verifyOtp(email, otp);
  if (!isValid) throw new AppError('Invalid or expired OTP', 400);

  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError('User not found', 404);

  // Mark user as verified
  await user.update({ isVerified: true });

  // Send welcome email
  await sendWelcomeEmail(email, user.name, user.role);

  logger.info(`Email verified: ${email}`);
  return true;
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  if (!user.isVerified) {
    throw new AppError('Please verify your email before logging in', 403);
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  logger.info(`User logged in: ${email}`);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshUserToken = async (token: string) => {
  const decoded = verifyRefreshToken(token);
  const user = await User.findByPk(decoded.id);
  if (!user) throw new AppError('User not found', 404);
  const payload = { id: user.id, email: user.email, role: user.role };
  return { accessToken: generateAccessToken(payload) };
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  // Always return success to avoid user enumeration
  if (!user) return;

  const token = uuidv4();
  await redisClient.setEx(`password_reset:${token}`, RESET_TOKEN_EXPIRY, user.id);

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(email, user.name, resetUrl);
  logger.info(`Password reset link sent: ${email}`);
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (token: string, newPassword: string) => {
  const userId = await redisClient.get(`password_reset:${token}`);
  if (!userId) throw new AppError('Reset token is invalid or has expired', 400);

  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);

  const hashed = await hashPassword(newPassword);
  await user.update({ password: hashed });

  // Invalidate the token after use
  await redisClient.del(`password_reset:${token}`);

  logger.info(`Password reset successful: ${user.email}`);
};
