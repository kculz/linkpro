import Bull from 'bull';
import { sendOtpEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@config/mailer.js';
import logger from '@utils/logger.js';

const emailQueue = new Bull('email', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

emailQueue.process(async (job) => {
  const { type, to, data } = job.data;
  switch (type) {
    case 'OTP':           await sendOtpEmail(to, data.otp, data.name); break;
    case 'WELCOME':       await sendWelcomeEmail(to, data.name, data.role); break;
    case 'PASSWORD_RESET':await sendPasswordResetEmail(to, data.name, data.resetUrl); break;
    default: logger.warn(`Unknown email job type: ${type}`);
  }
});

emailQueue.on('completed', (job) => logger.info(`Email job [${job.data.type}] completed for ${job.data.to}`));
emailQueue.on('failed', (job, err) => logger.error(`Email job [${job.data.type}] failed for ${job.data.to}: ${err.message}`));

export const addEmailJob = (type: string, to: string, data: Record<string, unknown>) =>
  emailQueue.add({ type, to, data }, { attempts: 3, backoff: 2000 });

export default emailQueue;
