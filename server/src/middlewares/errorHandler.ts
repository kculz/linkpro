import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger.js';

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.url} → ${statusCode}: ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.url} → ${statusCode}: ${err.message}`);
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export { AppError };
