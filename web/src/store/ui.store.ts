import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: (force?: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false, // Closed by default on mobile
  toggleSidebar: (force) => set((state) => ({ 
    isSidebarOpen: typeof force === 'boolean' ? force : !state.isSidebarOpen 
  })),
}));
