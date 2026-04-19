'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Building2, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Wallet,
  MessageSquare,
  Wrench,
  X
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Briefcase, label: 'Projects', href: '/projects' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Building2, label: 'Properties', href: '/properties' },
  { icon: Users, label: 'Tenants', href: '/tenants' },
  { icon: Wallet, label: 'Finance', href: '/finance' },
  { icon: Wrench, label: 'Maintenance', href: '/maintenance' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={cn(
      "w-64 bg-background h-screen fixed left-0 top-0 flex flex-col text-sidebar-foreground border-r border-white-[0.03] z-50 transition-transform duration-300 transform",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-105 transition-transform">
            <Building2 className="text-primary w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white italic uppercase">LinkPro</span>
        </div>
        <button 
          onClick={() => toggleSidebar(false)}
          className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-white/30"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-8 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => toggleSidebar(false)}
              className={cn(
                "relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/5 text-white shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] border border-primary/10" 
                  : "hover:bg-white-[0.02] text-white/40 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-r-lg shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
              <item.icon className={cn("w-5 h-5 transition-all duration-300", isActive ? "text-primary scale-110" : "text-white/20 group-hover:text-primary")} />
              <span className={cn("font-bold text-sm tracking-wide transition-all", isActive ? "translate-x-1" : "group-hover:translate-x-1")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white-[0.03]">
        <button className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-white/20 hover:bg-status-error/5 hover:text-status-error transition-all duration-300 font-bold text-xs uppercase tracking-widest">
          <LogOut className="w-5 h-5" />
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
}
