import redisClient from '@config/redis.js';
import logger from '@utils/logger.js';

const OTP_EXPIRY_SECONDS = 5 * 60;

export const generateOtp = async (email: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.setEx(`otp:${email}`, OTP_EXPIRY_SECONDS, otp);
  logger.debug(`OTP generated for ${email}`);
  return otp;
};

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  const stored = await redisClient.get(`otp:${email}`);
  if (!stored || stored !== otp) return false;
  await redisClient.del(`otp:${email}`);
  return true;
};
