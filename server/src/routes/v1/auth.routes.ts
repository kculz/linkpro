import { Router } from 'express';
import * as AuthController from '@controllers/v1/auth.controller.js';
import { validate } from '@middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  otpSchema,
  sendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@validations/auth.validation.js';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Create a new account and trigger OTP email
 */
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * POST /api/v1/auth/login
 * Log in — requires isVerified = true
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * POST /api/v1/auth/send-otp
 * Resend OTP to email
 */
router.post('/send-otp', validate(sendOtpSchema), AuthController.sendOtp);

/**
 * POST /api/v1/auth/verify-email
 * Verify OTP → sets isVerified = true & sends welcome email
 */
router.post('/verify-email', validate(otpSchema), AuthController.verifyOtp);

/**
 * POST /api/v1/auth/forgot-password
 * Send password reset link (UUID token valid 15 min)
 */
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);

/**
 * POST /api/v1/auth/reset-password
 * Validate token and set new password
 */
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

/**
 * POST /api/v1/auth/refresh-token
 * Get a new access token using a valid refresh token
 */
router.post('/refresh-token', AuthController.refreshToken);

export default router;
