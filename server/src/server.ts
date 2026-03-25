import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import sequelize from '@config/database.js';
import { connectRedis } from '@config/redis.js';
import logger from '@utils/logger.js';

// Import queues (registers processors)
import '@jobs/email.queue.js';

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.debug(`🔌 Client connected: ${socket.id}`);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    logger.debug(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    logger.debug(`❌ Client disconnected: ${socket.id}`);
  });
});

export { io };

const start = async () => {
  try {
    await connectRedis();
    await sequelize.authenticate();
    logger.info('✅ Database connected');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database synced');
    }

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`🌐 API versioned at /api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
