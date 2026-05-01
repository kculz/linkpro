'use client';

import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import NotificationCenter from '@/components/layout/NotificationCenter';

export default function Header() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-20 bg-background/40 backdrop-blur-2xl border-b border-white/[0.03] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => toggleSidebar()}
          className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-white/50 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative group flex-1 max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search properties, tasks..." 
            className="w-full bg-surface/40 border border-white-[0.03] rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium italic"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationCenter />
        
        <div className="h-6 w-[1px] bg-white-[0.03] mx-1"></div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors italic uppercase tracking-tighter">
              {user?.name || 'Authorized Personnel'}
            </p>
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-black leading-none mt-1">
              {user?.role?.replace('_', ' ') || 'SECURED'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg group-hover:scale-105 transition-transform">
            <User className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
