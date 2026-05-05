import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from '@middlewares/errorHandler.js';
import logger from '@utils/logger.js';

// Routes v1
import authRoutes from './routes/v1/auth.routes.js';
import propertyRoutes from './routes/v1/property.routes.js';
import projectRoutes from './routes/v1/project.routes.js';
import unitRoutes from './routes/v1/unit.routes.js';
import taskRoutes from './routes/v1/task.routes.js';
import activityRoutes from './routes/v1/activity.routes.js';
import tenantRoutes from './routes/v1/tenant.routes.js';
import maintenanceRoutes from './routes/v1/maintenance.routes.js';
import transactionRoutes from './routes/v1/transaction.routes.js';
import documentRoutes from './routes/v1/document.routes.js';
import vendorRoutes from './routes/v1/vendor.routes.js';
import analyticsRoutes from './routes/v1/analytics.routes.js';
import notificationRoutes from './routes/v1/notification.routes.js';
import messageRoutes from './routes/v1/message.routes.js';
import templateRoutes from './routes/v1/template.routes.js';
import teamRoutes from './routes/v1/team.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploads in development
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
}

// API Versioned Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/activity', activityRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/team', teamRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', version: 'v1', timestamp: new Date().toISOString() });
});

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;
