'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  Trash2, 
  Check,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useNotificationStore } from '@/store/notification.store';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, fetchNotifications, markRead, markAllRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Trigger Bell */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-surface/40 border border-white/[0.03] text-white/20 hover:text-white rounded-2xl flex items-center justify-center transition-all hover:bg-surface/60 group"
      >
        <Bell className={clsx("w-6 h-6 transition-transform", isOpen && "scale-110")} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-error text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-background animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-background/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Panel */}
      <div className={clsx(
        "fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-white/[0.05] z-[70] shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-all duration-500 transform",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-10 border-b border-white/[0.03] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Intel Alerts</h2>
              <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Command & Control Notifications</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-10 py-6 border-b border-white/[0.03] flex items-center justify-between bg-white/[0.01]">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">{unreadCount} Unread Logs</span>
            <button 
              onClick={markAllRead}
              className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest italic flex items-center gap-2"
            >
              Mark all as read <Check className="w-3 h-3" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-white/[0.02]">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={clsx(
                      "p-8 group cursor-pointer transition-all hover:bg-white/[0.02] relative",
                      !n.read && "bg-primary/[0.02]"
                    )}
                    onClick={() => !n.read && markRead(n.id)}
                  >
                    {!n.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
                    
                    <div className="flex gap-6">
                      <div className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shadow-inner",
                        n.type === 'URGENT' ? "bg-status-error/10 border-status-error/20 text-status-error animate-pulse" :
                        n.type === 'WARNING' ? "bg-status-warning/10 border-status-warning/20 text-status-warning" :
                        n.type === 'SUCCESS' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                        "bg-white/5 border-white/10 text-white/40"
                      )}>
                        {n.type === 'URGENT' ? <AlertTriangle className="w-6 h-6" /> :
                         n.type === 'WARNING' ? <Clock className="w-6 h-6" /> :
                         n.type === 'SUCCESS' ? <CheckCircle2 className="w-6 h-6" /> :
                         <Info className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={clsx(
                            "text-xs font-black italic uppercase tracking-tighter",
                            !n.read ? "text-white" : "text-white/40"
                          )}>{n.title}</h4>
                          <span className="text-[8px] font-black text-white/10 uppercase italic">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: false }).replace('about ', '')}</span>
                        </div>
                        <p className={clsx(
                          "text-[9px] font-bold uppercase tracking-widest italic leading-relaxed",
                          !n.read ? "text-white/40" : "text-white/10"
                        )}>{n.message}</p>
                        
                        {n.link && (
                          <Link 
                            href={n.link}
                            onClick={() => setIsOpen(false)}
                            className="mt-4 flex items-center gap-2 text-[8px] font-black text-primary uppercase tracking-widest italic hover:text-white transition-colors"
                          >
                            View Intel <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 p-20 text-center">
                <Bell className="w-16 h-16 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting tactical alerts...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-10 border-t border-white/[0.03] text-center">
             <button className="text-[10px] font-black text-white/10 hover:text-white transition-colors uppercase tracking-[0.3em] italic">Archive All Intelligence</button>
          </div>
        </div>
      </div>
    </div>
  );
}
