'use client';

import { useEffect, useState, use } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Plus, 
  Settings, 
  PlayCircle, 
  ArrowUpRight,
  Loader2,
  Filter,
  Search,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-react';
import { useProjectStore } from '@/store/project.store';
import { useAuthStore } from '@/store/auth.store';
import { Task } from '@/services/taskService';
import AddTaskModal from '@/components/projects/AddTaskModal';
import EditProjectModal from '@/components/projects/EditProjectModal';
import { clsx } from 'clsx';
import { useSocket } from '@/hooks/useSocket';

const COLUMNS = [
  { id: 'BACKLOG', label: 'Backlog', color: 'text-slate-500' },
  { id: 'TODO', label: 'To Do', color: 'text-primary' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'text-amber-500' },
  { id: 'REVIEW', label: 'Review', color: 'text-indigo-500' },
  { id: 'DONE', label: 'Done', color: 'text-status-success' },
];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentProject, loading, fetchProjectById, updateTaskStatus, deleteTask } = useProjectStore();
  const { user } = useAuthStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(COLUMNS.map(c => c.id));

  const canManage = user?.role === 'ADMIN' || user?.role === 'PM';

  // Real-time synchronization
  useSocket(id);

  useEffect(() => {
    fetchProjectById(id);
  }, [id, fetchProjectById]);

  if (loading || !currentProject) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
          <p className="text-white/20 mt-6 font-black italic uppercase tracking-widest text-[10px]">Accessing Secure Project Metadata...</p>
        </div>
      </DashboardLayout>
    );
  }

  const filteredTasks = currentProject.tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.assignee?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilters.includes(task.status);
    return matchesSearch && matchesFilter;
  });

  const toggleFilter = (status: string) => {
    setActiveFilters(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest italic">{currentProject.type}</span>
              <span className="text-white/10 font-black">/ / /</span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{currentProject.status}</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">{currentProject.name}</h1>
            <p className="text-white/20 mt-6 font-bold italic uppercase tracking-[0.25em] text-[10px] max-w-2xl">{currentProject.description || "High-priority operational theater specializing in property life-cycle management and strategic deployment."}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditProjectModalOpen(true)}
              className="px-8 py-4 bg-surface/40 border border-white/[0.03] text-white/20 hover:text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-widest hover:bg-surface/60 transition-all flex items-center gap-3 shadow-2xl"
            >
              <Settings className="w-4 h-4" /> Operations Control
            </button>
            {canManage && (
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
              >
                <Plus className="w-5 h-5" /> Deploy Task
              </button>
            )}
          </div>
        </div>

        {/* Tactical Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="px-8 py-4 bg-surface/40 border border-white/[0.03] rounded-[2rem] flex items-center gap-6 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Operational Alpha</p>
              <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{currentProject.progress}% <span className="text-[10px] text-white/5 tracking-normal lowercase">efficiency</span></p>
            </div>
          </div>
          <div className="px-8 py-4 bg-surface/40 border border-white/[0.03] rounded-[2rem] flex items-center gap-6 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Mission Deadline</p>
              <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{new Date(currentProject.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="px-8 py-4 bg-surface/40 border border-white/[0.03] rounded-[2rem] flex items-center gap-6 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Target Status</p>
              <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{currentProject.status}</p>
            </div>
          </div>
        </div>

        {/* Task Control Center */}
        <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-6 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-4">
            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search tactical items..."
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="w-4 h-4 text-white/20 mr-2" />
              {COLUMNS.map(col => (
                <button 
                  key={col.id}
                  onClick={() => toggleFilter(col.id)}
                  className={clsx(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all border",
                    activeFilters.includes(col.id) 
                      ? "bg-white/5 border-white/10 text-white shadow-lg" 
                      : "bg-transparent border-transparent text-white/10 hover:text-white/30"
                  )}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {COLUMNS.filter(col => activeFilters.includes(col.id)).map((column) => (
              <div key={column.id} className="bg-surface/20 rounded-[3rem] p-4 flex flex-col gap-4 min-h-[600px] border border-white/[0.03] shadow-inner backdrop-blur-sm relative group/col">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx("w-1.5 h-1.5 rounded-full shadow-lg animate-pulse", column.color.replace('text-', 'bg-'))} />
                    <h3 className={clsx("font-black text-[10px] uppercase tracking-[0.25em] italic", column.color)}>{column.label}</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/5 uppercase tracking-widest">{filteredTasks?.filter(t => t.status === column.id).length}</span>
                </div>
                
                <div className="flex-1 flex flex-col gap-4">
                  {filteredTasks?.filter(t => t.status === column.id).map((task) => (
                    <div key={task.id} className="bg-surface/40 p-6 rounded-[2.5rem] border border-white/[0.03] shadow-xl hover:border-white/10 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <span className={clsx(
                          "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest italic border",
                          task.priority === 'URGENT' ? "bg-status-error/10 text-status-error border-status-error/20" :
                          task.priority === 'HIGH' ? "bg-status-warning/10 text-status-warning border-status-warning/20" :
                          "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {task.priority}
                        </span>
                        
                        {canManage && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-1.5 hover:bg-primary/10 rounded-lg text-white/10 hover:text-primary transition-all"
                              title="Move Forward"
                              onClick={() => {
                                const nextIndex = COLUMNS.findIndex(c => c.id === column.id) + 1;
                                if (nextIndex < COLUMNS.length) {
                                  updateTaskStatus(task.id, COLUMNS[nextIndex].id as any);
                                }
                              }}
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 hover:bg-status-error/10 rounded-lg text-white/10 hover:text-status-error transition-all"
                              title="Delete Task"
                              onClick={() => {
                                if (confirm('Are you sure you want to decommission this tactical item?')) {
                                  deleteTask(task.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-black text-white text-xs italic uppercase tracking-tighter mb-4 leading-relaxed relative z-10 group-hover:text-primary transition-colors">{task.title}</h4>
                      
                      <div className="flex items-center justify-between mt-auto relative z-10">
                        <div className="flex items-center gap-2 text-white/20">
                          <Clock className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest italic">{task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'ASAP'}</span>
                        </div>
                        
                        {task.assignee ? (
                          <div className="w-8 h-8 rounded-xl border-2 border-surface overflow-hidden bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary italic shadow-lg" title={task.assignee.name}>
                            {task.assignee.name.charAt(0)}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl border-2 border-surface border-dashed border-white/5 flex items-center justify-center text-white/5">
                            <Users className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredTasks?.filter(t => t.status === column.id).length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.02] rounded-[2.5rem] py-12">
                      <p className="text-[8px] font-black text-white/5 uppercase tracking-[0.25em] italic">Sector Vacant</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddTaskModal 
          isOpen={isAddTaskModalOpen} 
          onClose={() => setIsAddTaskModalOpen(false)} 
          projectId={id} 
        />
        
        <EditProjectModal 
          isOpen={isEditProjectModalOpen} 
          onClose={() => setIsEditProjectModalOpen(false)} 
          project={currentProject} 
        />
      </div>
    </DashboardLayout>
  );
}
