'use client';

import React, { useEffect } from 'react';
import { useProjectStore } from '@/store/project.store';
import { useAuthStore } from '@/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layout,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { clsx } from 'clsx';

const COLUMNS = [
  { id: 'BACKLOG', label: 'Backlog', icon: Clock, color: 'text-slate-400' },
  { id: 'TODO', label: 'To Do', icon: AlertCircle, color: 'text-amber-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Layout, color: 'text-blue-500' },
  { id: 'REVIEW', label: 'Review', icon: Search, color: 'text-purple-500' },
  { id: 'DONE', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
];

export default function GlobalTasksPage() {
  const { allTasks, loading, fetchAllTasks, updateTaskStatus } = useProjectStore();
  const { user } = useAuthStore();

  const canManage = user?.role === 'ADMIN' || user?.role === 'PM';

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  const handleMove = (taskId: string, currentStatus: string) => {
    if (!canManage) return;
    const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);
    if (currentIndex < COLUMNS.length - 1) {
      updateTaskStatus(taskId, COLUMNS[currentIndex + 1].id as any);
    }
  };

  // Group tasks by status
  const tasksGrouped = COLUMNS.reduce((acc, column) => {
    acc[column.id] = allTasks.filter(t => t.status === column.id);
    return acc;
  }, {} as Record<string, typeof allTasks>);

  const priorityColors = {
    LOW: 'text-status-success',
    MEDIUM: 'text-status-info',
    HIGH: 'text-status-warning',
    URGENT: 'text-status-error',
  };

  if (loading && allTasks.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full scale-110" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Mission Control</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Real-time synchronization across all active operations</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Tactical Search..." 
                className="bg-surface/40 border border-white-[0.03] rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-80 text-white placeholder:text-white/20 italic font-bold"
              />
            </div>
            <button className="w-12 h-12 bg-surface/40 border border-white-[0.03] rounded-xl text-white/20 hover:text-white hover:bg-surface/60 transition-all flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 -mx-8 px-8 scrollbar-hide">
          {COLUMNS.map((column) => (
            <div key={column.id} className="min-w-[360px] w-full flex flex-col gap-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <h3 className="font-black text-white/40 text-[10px] uppercase tracking-[0.25em] italic">{column.label}</h3>
                  <span className="bg-white/5 border border-white/10 text-white/20 text-[10px] px-2 py-0.5 rounded-md font-black italic">
                    {tasksGrouped[column.id]?.length || 0}
                  </span>
                </div>
              </div>

              <div className="bg-surface/20 rounded-[3rem] p-5 flex flex-col gap-5 min-h-[650px] border border-white/[0.03] shadow-inner backdrop-blur-sm relative group/col">
                <div className="absolute inset-0 bg-primary-[0.01] opacity-0 group-hover/col:opacity-100 transition-opacity pointer-events-none" />
                
                {tasksGrouped[column.id]?.map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-surface p-6 rounded-[2.5rem] border border-white/[0.05] shadow-2xl hover:border-primary/40 transition-all group relative overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-[0.02] via-transparent to-transparent" />
                    
                    <div className="mb-4 relative z-10 flex flex-wrap gap-2">
                       <span className={clsx(
                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 italic shadow-sm",
                        priorityColors[task.priority as keyof typeof priorityColors] || 'text-white/40'
                      )}>
                        {task.priority}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 bg-white/5 text-white/40 italic">
                        {task.projectId?.substring(0, 8)}
                      </span>
                    </div>

                    <h4 className="font-black text-white leading-tight mb-3 group-hover:text-primary transition-colors italic uppercase tracking-tighter relative z-10 text-base">{task.title}</h4>
                    <p className="text-[11px] text-white/20 line-clamp-3 mb-6 font-bold leading-relaxed italic relative z-10">{task.description}</p>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.03] relative z-10">
                      <div className="flex items-center gap-2 text-white/10">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.1em] italic">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Standby'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {canManage && (
                          <button 
                            onClick={() => handleMove(task.id, task.status)}
                            className="p-1.5 hover:bg-primary/10 rounded-lg text-white/10 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                        <div className="w-8 h-8 rounded-xl border border-white/5 overflow-hidden bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary italic shadow-lg">
                          {task.assignee?.name.charAt(0) || '?'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(!tasksGrouped[column.id] || tasksGrouped[column.id].length === 0) && (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-5 select-none text-white">
                    <Layout className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic text-center">Inert Column</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
