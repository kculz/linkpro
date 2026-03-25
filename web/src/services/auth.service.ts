import api from './api';

export const authService = {
  register: (data: { name: string; email: string; password: string; role?: string; phone?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  sendOtp: (email: string) =>
    api.post('/auth/send-otp', { email }),

  verifyEmail: (email: string, otp: string) =>
    api.post('/auth/verify-email', { email, otp }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password, confirmPassword: password }),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),
};
