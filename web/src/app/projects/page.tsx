'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Plus, Calendar, DollarSign, Loader2, PlayCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useProjectStore } from '@/store/project.store';
import { useAuthStore } from '@/store/auth.store';
import AddProjectModal from '@/components/projects/AddProjectModal';

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS':
    case 'ON_TRACK':
      return { label: 'On Track', color: 'bg-emerald-50 text-status-success border-emerald-100', icon: PlayCircle };
    case 'DELAYED':
      return { label: 'Delayed', color: 'bg-amber-50 text-status-warning border-amber-100', icon: AlertCircle };
    case 'COMPLETED':
      return { label: 'Completed', color: 'bg-blue-50 text-primary-blue border-blue-100', icon: CheckCircle2 };
    case 'PLANNING':
    default:
      return { label: 'Planning', color: 'bg-slate-50 text-neutral-medium border-slate-100', icon: Clock };
  }
};

export default function ProjectsPage() {
  const { projects, loading, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canManage = user?.role === 'ADMIN' || user?.role === 'PM';

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Projects</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-xs">Tactical Overview • Active Operations</p>
          </div>
          {canManage && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-black italic uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center gap-3 border border-white/10"
            >
              <Plus className="w-5 h-5" /> New Operation
            </button>
          )}
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-white/20 mt-6 font-black italic uppercase tracking-widest text-[10px]">Synchronizing Data Streams...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-surface/30 rounded-[3rem] border border-white/[0.03] p-24 text-center backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-[0.01] group-hover:bg-primary-[0.02] transition-colors" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/10 shadow-inner">
                <Plus className="w-12 h-12 text-primary/20" />
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">No Active Operations</h3>
              <p className="text-white/20 max-w-sm mx-auto mt-4 font-bold italic leading-relaxed uppercase text-[10px] tracking-widest">Awaiting command input. Initialize your first project to begin tracking property life-cycle development.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-12 px-8 py-4 bg-primary text-white rounded-2xl font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-primary/20"
              >
                <Plus className="w-5 h-5" /> Initialize Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`}
                className="group bg-surface/40 rounded-[2.5rem] border border-white/[0.03] hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-56 w-full">
                  <Image 
                    src={project.image || '/images/project-placeholder.png'} 
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-[0.8] group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 right-6">
                    <span className={clsx(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg italic",
                      getStatusDetails(project.status).color
                    )}>
                      {getStatusDetails(project.status).label}
                    </span>
                  </div>
                </div>

                <div className="p-8 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">{project.type}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors tracking-tighter italic uppercase">{project.name}</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/30 italic">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Deadline: {new Date(project.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{project.progress}%</span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-white-[0.03] rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="bg-primary h-full transition-all duration-1000 shadow-[0_0_12px_rgba(59,130,246,0.6)]" 
                        style={{ width: `${project.progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
