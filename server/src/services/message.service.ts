import Message from '@models/Message.js';
import User from '@models/User.js';
import { Op, fn, col, literal } from 'sequelize';
import sequelize from '@config/database.js';

/**
 * Get all conversations for a user, with the latest message and the other participant.
 */
export const getConversations = async (userId: string) => {
  // Find distinct conversationIds for this user
  const convIds: any[] = await Message.findAll({
    attributes: [[fn('DISTINCT', col('conversationId')), 'conversationId']],
    where: {
      [Op.or]: [{ senderId: userId }, { receiverId: userId }],
    },
    raw: true,
  });

  const conversations = await Promise.all(
    convIds.map(async (row: any) => {
      const cid = row.conversationId;

      // Latest message
      const lastMessage = await Message.findOne({
        where: { conversationId: cid },
        order: [['createdAt', 'DESC']],
        raw: true,
      });

      // Unread count for this user
      const unreadCount = await Message.count({
        where: { conversationId: cid, receiverId: userId, read: false },
      });

      // Other participant
      const otherUserId = lastMessage!.senderId === userId ? lastMessage!.receiverId : lastMessage!.senderId;
      const otherUser = await User.findByPk(otherUserId, {
        attributes: ['id', 'name', 'email', 'avatar', 'role'],
        raw: true,
      });

      return {
        conversationId: cid,
        lastMessage,
        unreadCount,
        participant: otherUser,
      };
    })
  );

  // Sort by latest message
  conversations.sort((a, b) => {
    const aTime = new Date(a.lastMessage?.createdAt || 0).getTime();
    const bTime = new Date(b.lastMessage?.createdAt || 0).getTime();
    return bTime - aTime;
  });

  return conversations;
};

/**
 * Get all messages in a conversation, marking unread ones as read.
 */
export const getMessages = async (conversationId: string, userId: string) => {
  // Mark incoming messages as read
  await Message.update(
    { read: true },
    { where: { conversationId, receiverId: userId, read: false } }
  );

  return Message.findAll({
    where: { conversationId },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
      { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] },
    ],
    order: [['createdAt', 'ASC']],
  });
};

/**
 * Send a message.
 */
export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  const conversationId = Message.buildConversationId(senderId, receiverId);

  const message = await Message.create({
    senderId,
    receiverId,
    conversationId,
    content,
  });

  // Return with sender/receiver info
  return Message.findByPk(message.id, {
    include: [
      { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
      { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] },
    ],
  });
};

/**
 * Total unread count for a user.
 */
export const getUnreadCount = async (userId: string) => {
  return Message.count({
    where: { receiverId: userId, read: false },
  });
};

/**
 * Get all potential contacts (users in the system).
 */
export const getContacts = async (userId: string) => {
  return User.findAll({
    where: { id: { [Op.ne]: userId } },
    attributes: ['id', 'name', 'email', 'avatar', 'role'],
    order: [['name', 'ASC']],
  });
};
