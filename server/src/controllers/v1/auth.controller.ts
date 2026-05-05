import { Request, Response, NextFunction } from 'express';
import * as AuthService from '@services/auth.service.js';

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Account created. Check your email for a verification code.',
      data: user,
    });
  } catch (err) { next(err); }
};

// ─── Send OTP ────────────────────────────────────────────────────────────────
export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await AuthService.sendOtp(req.body.email);
    res.status(200).json({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) { next(err); }
};

// ─── Verify Email via OTP ────────────────────────────────────────────────────
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await AuthService.verifyUserOtp(req.body.email, req.body.otp);
    res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (err) { next(err); }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AuthService.loginUser(req.body.email, req.body.password);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) { res.status(400).json({ success: false, message: 'Refresh token required' }); return; }
    const result = await AuthService.refreshUserToken(token);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await AuthService.forgotPassword(req.body.email);
    // Always return success (security: don't confirm if email exists)
    res.status(200).json({
      success: true,
      message: 'If that email is registered, you will receive a reset link shortly.',
    });
  } catch (err) { next(err); }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await AuthService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({ success: true, message: 'Password updated successfully. You can now log in.' });
  } catch (err) { next(err); }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await AuthService.getMe((req as any).user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await AuthService.updateProfile((req as any).user.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (err) { next(err); }
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new passwords are required' });
      return;
    }
    await AuthService.changePassword((req as any).user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) { next(err); }
};
