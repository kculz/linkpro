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

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', version: 'v1', timestamp: new Date().toISOString() });
});

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;
