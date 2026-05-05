import User from '@models/User.js';
import { hashPassword } from '@utils/password.js';
import { AppError } from '@middlewares/errorHandler.js';

export const getAllUsers = async (query: any = {}) => {
  return User.findAll({
    where: query,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']]
  });
};

export const getUserById = async (id: string) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const createEmployee = async (data: any) => {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw new AppError('User with this email already exists', 400);

  // Default password if not provided
  const tempPassword = data.password || 'LinkPro2026!';
  const hashed = await hashPassword(tempPassword);

  return User.create({
    ...data,
    password: hashed,
    isVerified: true // Employees added by admin are pre-verified for now
  });
};

export const updateUserRole = async (userId: string, role: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  
  await user.update({ role });
  return user;
};

export const removeUser = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 404);
  
  // Prevent deleting the last owner if we had more logic, but for now just delete
  return user.destroy();
};
