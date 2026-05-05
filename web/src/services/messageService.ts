import api from './api';

export interface MessageUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: MessageUser;
  receiver?: MessageUser;
}

export interface Conversation {
  conversationId: string;
  lastMessage: Message;
  unreadCount: number;
  participant: MessageUser;
}

export const getConversations = async () => {
  const { data } = await api.get('/messages/conversations');
  return data.data as Conversation[];
};

export const getMessages = async (conversationId: string) => {
  const { data } = await api.get(`/messages/${conversationId}`);
  return data.data as Message[];
};

export const sendMessage = async (receiverId: string, content: string) => {
  const { data } = await api.post('/messages', { receiverId, content });
  return data.data as Message;
};

export const getUnreadCount = async () => {
  const { data } = await api.get('/messages/unread-count');
  return data.data.count as number;
};

export const getContacts = async () => {
  const { data } = await api.get('/messages/contacts');
  return data.data as MessageUser[];
};
