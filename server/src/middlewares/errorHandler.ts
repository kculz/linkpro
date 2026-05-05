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
  const sqlError = (err as any).original || (err as any).parent;
  const logMessage = sqlError
    ? `${req.method} ${req.url} → ${statusCode}: ${sqlError.message || err.message} [SQL: ${(err as any).sql || 'n/a'}]`
    : `${req.method} ${req.url} → ${statusCode}: ${err.message}`;
  if (statusCode >= 500) {
    logger.error(logMessage, { stack: err.stack });
  } else {
    logger.warn(logMessage);
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export { AppError };
