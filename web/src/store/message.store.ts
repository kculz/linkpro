import { create } from 'zustand';
import * as messageService from '@/services/messageService';

interface MessageState {
  conversations: messageService.Conversation[];
  messages: messageService.Message[];
  contacts: messageService.MessageUser[];
  activeConversationId: string | null;
  unreadCount: number;
  loading: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  fetchContacts: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  setActiveConversation: (id: string | null) => void;
  addMessageLocally: (message: messageService.Message) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: [],
  contacts: [],
  activeConversationId: null,
  unreadCount: 0,
  loading: false,

  fetchConversations: async () => {
    try {
      const conversations = await messageService.getConversations();
      set({ conversations });
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loading: true, activeConversationId: conversationId });
    try {
      const messages = await messageService.getMessages(conversationId);
      set({ messages, loading: false });
      // Update unread count after reading
      get().fetchUnreadCount();
      get().fetchConversations();
    } catch (err) {
      console.error('Failed to fetch messages', err);
      set({ loading: false });
    }
  },

  fetchContacts: async () => {
    try {
      const contacts = await messageService.getContacts();
      set({ contacts });
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await messageService.getUnreadCount();
      set({ unreadCount });
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  },

  sendMessage: async (receiverId, content) => {
    try {
      const message = await messageService.sendMessage(receiverId, content);
      // Message will arrive via socket — no need to manually add
    } catch (err) {
      console.error('Failed to send message', err);
    }
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessageLocally: (message) => {
    const { activeConversationId, messages } = get();
    // If the message belongs to the active conversation, add it
    if (message.conversationId === activeConversationId) {
      const exists = messages.some(m => m.id === message.id);
      if (!exists) {
        set({ messages: [...messages, message] });
      }
    }
    // Refresh conversations list to update last message / unread
    get().fetchConversations();
    get().fetchUnreadCount();
  },
}));
