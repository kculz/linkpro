import Activity from '@models/Activity.js';
import User from '@models/User.js';
import { io } from '../server.js';
import logger from '@utils/logger.js';

interface LogActivityParams {
  userId: string;
  type: Activity['type'];
  description: string;
  targetId: string;
  targetType: Activity['targetType'];
  metadata?: any;
}

export const logActivity = async (params: LogActivityParams) => {
  try {
    const activity = await Activity.create(params);
    
    // Fetch user info for real-time broadcast
    const activityWithUser = await Activity.findByPk(activity.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }]
    });

    // Broadcast to global dashboard room
    io.emit('activity:new', activityWithUser);

    // Also broadcast to specific target room if applicable
    io.to(params.targetId).emit('activity:new', activityWithUser);

    return activityWithUser;
  } catch (error) {
    logger.error('Failed to log activity:', error);
  }
};

export const getRecentActivities = async (limit = 10, where = {}) => {
  return Activity.findAll({
    where,
    limit,
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }]
  });
};
