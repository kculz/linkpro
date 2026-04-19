'use client';

import { useEffect, useState, use } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Loader2, 
  ArrowLeft, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  Filter,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProjectStore } from '@/store/project.store';
import { useAuthStore } from '@/store/auth.store';
import { Task } from '@/services/taskService';
import AddTaskModal from '@/components/projects/AddTaskModal';

const COLUMNS = [
  { id: 'BACKLOG', label: 'Backlog', color: 'text-slate-500' },
  { id: 'TODO', label: 'To Do', color: 'text-blue-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'text-amber-500' },
  { id: 'REVIEW', label: 'Review', color: 'text-purple-500' },
  { id: 'DONE', label: 'Done', color: 'text-emerald-500' },
] as const;

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentProject, loading, fetchProjectById, updateTaskStatus, deleteTask } = useProjectStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  useEffect(() => {
    fetchProjectById(id);
  }, [id, fetchProjectById]);

  if (loading || !currentProject) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
        </div>
      </DashboardLayout>
    );
  }

  const tasksByStatus = (status: string) => {
    return currentProject.tasks?.filter(t => t.status === status) || [];
  };

  const priorityColors = {
    LOW: 'bg-emerald-50 text-status-success',
    MEDIUM: 'bg-blue-50 text-status-info',
    HIGH: 'bg-amber-50 text-status-warning',
    URGENT: 'bg-red-50 text-status-error',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-6">
            <Link 
              href="/projects" 
              className="group flex items-center gap-3 text-white/20 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.3em] w-fit italic"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Operations
            </Link>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                <Image 
                  src={currentProject.image || '/images/project-placeholder.png'} 
                  alt={currentProject.name} 
                  fill 
                  className="object-cover brightness-75 group-hover:brightness-100 transition-all duration-700 saturate-50 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-8 underline-offset-8 mb-4">{currentProject.name}</h1>
                <div className="flex items-center gap-4 text-white/20">
                  <span className="text-[10px] font-black px-3 py-1 bg-primary/5 border border-primary/20 rounded-lg uppercase tracking-widest italic text-primary">{currentProject.type}</span>
                  <span className="text-white/5 font-black">/ / /</span>
                  <span className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest italic">
                    <Calendar className="w-4 h-4 text-primary" /> Target: {new Date(currentProject.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-8 py-4 bg-surface/40 border border-white/[0.03] rounded-[2rem] flex items-center gap-6 shadow-2xl backdrop-blur-md">
              <div className="text-right">
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-none mb-2">Completion Status</p>
                <p className="text-2xl font-black text-white leading-none italic">{currentProject.progress}%</p>
              </div>
              <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                <div className="bg-primary h-full transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.8)]" style={{ width: `${currentProject.progress}%` }} />
              </div>
            </div>
            {canManage && (
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="w-14 h-14 bg-primary text-white rounded-[1.5rem] font-black flex items-center justify-center hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-primary/20 group"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Asset Valuation', val: `$${Number(currentProject.budget).toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Operational Cost', val: `$${Number(currentProject.spent).toLocaleString()}`, icon: Clock, color: 'text-status-error', bg: 'bg-status-error/10' },
            { label: 'Task Efficiency', val: `${currentProject.tasks?.filter(t => t.status === 'DONE').length || 0} / ${currentProject.tasks?.length || 0}`, icon: CheckCircle2, color: 'text-status-success', bg: 'bg-status-success/10' },
            { label: 'Active Sprints', val: '02 Ongoing', icon: PlayCircle, color: 'text-status-warning', bg: 'bg-status-warning/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl hover:border-white/10 transition-all group overflow-hidden relative">
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 flex flex-col gap-6">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center border border-current opacity-20 group-hover:opacity-100 transition-all`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-2 italic">{stat.label}</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{stat.val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-8 overflow-x-auto pb-12 -mx-8 px-8 scrollbar-hide">
          {COLUMNS.map((column) => (
            <div key={column.id} className="min-w-[340px] w-full flex flex-col gap-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <h3 className="font-black text-white/40 text-[10px] uppercase tracking-[0.2em] italic">{column.label}</h3>
                  <span className="bg-white/5 border border-white/10 text-white/20 text-[10px] px-2 py-0.5 rounded-md font-black italic">
                    {tasksByStatus(column.id).length}
                  </span>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-xl text-white/10 hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-surface/20 rounded-[3rem] p-4 flex flex-col gap-4 min-h-[600px] border border-white/[0.03] shadow-inner backdrop-blur-sm relative group/col">
                <div className="absolute inset-0 bg-primary-[0.01] opacity-0 group-hover/col:opacity-100 transition-opacity pointer-events-none" />
                {tasksByStatus(column.id).map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-surface p-6 rounded-[2rem] border border-white/[0.05] shadow-2xl hover:border-primary/40 transition-all group relative overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-[0.02] via-transparent to-transparent" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <span className={clsx(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 italic",
                        priorityColors[task.priority as keyof typeof priorityColors]
                      )}>
                        {task.priority}
                      </span>
                      {canManage && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-1.5 hover:bg-primary/10 rounded-lg text-white/10 hover:text-primary transition-all"
                            title="Move Status"
                            onClick={() => {
                              const nextIndex = COLUMNS.findIndex(c => c.id === column.id) + 1;
                              if (nextIndex < COLUMNS.length) {
                                updateTaskStatus(task.id, COLUMNS[nextIndex].id as any);
                              }
                            }}
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h4 className="font-black text-white leading-tight mb-3 group-hover:text-primary transition-colors italic uppercase tracking-tighter relative z-10">{task.title}</h4>
                    <p className="text-xs text-white/20 line-clamp-3 mb-6 font-bold leading-relaxed italic relative z-10">{task.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.03] relative z-10">
                      <div className="flex items-center gap-2 text-white/10">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Pending'}
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        {task.assignee ? (
                          <div className="w-8 h-8 rounded-xl border-2 border-surface overflow-hidden bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary italic shadow-lg">
                            {task.assignee.name.charAt(0)}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl border-2 border-dashed border-white/5 flex items-center justify-center text-white/5 italic font-black text-[10px]">
                            ?
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {tasksByStatus(column.id).length === 0 && (
                  <div className="py-32 text-center px-10">
                    <p className="text-[10px] text-white/5 font-black uppercase tracking-[0.3em] italic">Awaiting Deployment</p>
                  </div>
                )}
              </div>
              
              {canManage && (
                <button 
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="mt-2 flex items-center justify-center gap-3 py-5 border border-dashed border-white/5 rounded-[2rem] text-[10px] font-black text-white/10 uppercase tracking-[0.2em] italic hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                  Deploy to {column.label}
                </button>
              )}
            </div>
          ))}
        </div>

        <AddTaskModal 
          isOpen={isAddTaskModalOpen} 
          onClose={() => setIsAddTaskModalOpen(false)} 
          projectId={currentProject.id} 
        />
      </div>
    </DashboardLayout>
  );
}
