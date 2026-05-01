'use client';

import { useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  Clock,
  Plus,
  Loader2,
  PlayCircle,
  DollarSign
} from 'lucide-react';
import { useActivityStore } from '@/store/activity.store';
import { useProjectStore } from '@/store/project.store';
import { useTransactionStore } from '@/store/transaction.store';
import { useSocket } from '@/hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function Dashboard() {
  const { activities, loading: activityLoading, fetchActivities } = useActivityStore();
  const { projects, loading: projectLoading, fetchProjects } = useProjectStore();
  const { stats: finStats, fetchStats: fetchFinStats } = useTransactionStore();
  
  // Real-time synchronization
  useSocket();

  useEffect(() => {
    fetchActivities({ limit: 10 });
    fetchProjects();
    fetchFinStats();
  }, [fetchActivities, fetchProjects, fetchFinStats]);

  const recentProjects = projects
    .filter(p => p.status !== 'COMPLETED')
    .slice(0, 4);

  const stats = [
    { label: 'Active Deployments', value: projects.filter(p => p.status !== 'COMPLETED').length, change: '+2', trend: 'up', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Portfolio Assets', value: '24', change: '+3', trend: 'up', icon: Building2, color: 'bg-emerald-500' },
    { label: 'Active Intel', value: activities.length, change: 'Live Feed', trend: 'info', icon: Users, color: 'bg-indigo-500' },
    { label: 'Revenue Yield', value: `$${(finStats?.totalRevenue || 0).toLocaleString()}`, change: 'Current Month', trend: 'up', icon: DollarSign, color: 'bg-amber-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Dashboard Overview</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Command and Control • Real-time Portfolio Intel</p>
          </div>
          <Link 
            href="/projects"
            className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
          >
            <Plus className="w-5 h-5" /> Initialize Project
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl hover:border-white/10 transition-all group overflow-hidden relative">
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.color}/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={clsx(stat.color, "w-14 h-14 rounded-2xl flex items-center justify-center text-white border border-current shadow-[0_0_15px_rgba(0,0,0,0.3)]")}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black italic uppercase tracking-widest">
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 text-status-success" /> : <Clock className="w-3.5 h-3.5 text-primary" />}
                    <span className={stat.trend === 'up' ? 'text-status-success' : 'text-primary'}>{stat.change}</span>
                  </div>
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{stat.value}</h3>
                  <span className="text-white/5 font-black text-xs italic tracking-widest uppercase">/ unit status</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Projects & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] shadow-2xl overflow-hidden backdrop-blur-md relative group">
              <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
              <div className="p-8 border-b border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Active Deployments</h3>
                </div>
                <Link href="/projects" className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest italic flex items-center gap-2 group/btn underline decoration-primary/30 underline-offset-4">
                  Full Intel <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectLoading ? (
                  <div className="col-span-2 py-20 flex flex-col items-center justify-center opacity-20">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-[10px] font-black uppercase italic tracking-widest">Scanning Project Orbits...</p>
                  </div>
                ) : recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <Link 
                      key={project.id} 
                      href={`/projects/${project.id}`}
                      className="p-8 bg-white/[0.02] border border-white/[0.03] rounded-[2.5rem] hover:bg-white/[0.05] hover:border-primary/30 transition-all group/proj relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-2 italic">{project.type}</p>
                          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover/proj:text-primary transition-colors">{project.name}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest italic text-white/40">
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest italic text-white/20">
                          <span>Progress</span>
                          <span className="text-white">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                          <div 
                            className="bg-primary h-full shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-1000" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 py-20 flex flex-col items-center justify-center opacity-10">
                    <PlayCircle className="w-16 h-16 mb-4" />
                    <p className="text-[10px] font-black uppercase italic tracking-widest">No active deployments detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] shadow-2xl overflow-hidden p-8 backdrop-blur-md relative">
              <div className="flex items-center gap-4 mb-10 px-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Real-Time Intel</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                {activityLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center opacity-20">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="text-[8px] font-black uppercase tracking-widest italic">Syncing Intel...</p>
                  </div>
                ) : activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex gap-6 p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all cursor-pointer group/item border border-transparent hover:border-white/[0.05]">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover/item:bg-primary/20 group-hover/item:border-primary/30 transition-all shadow-inner overflow-hidden">
                        {activity.user?.avatar ? (
                          <img src={activity.user.avatar} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-black text-white/20 group-hover/item:text-primary italic">{activity.user?.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{activity.user?.name}</p>
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1 italic leading-relaxed">{activity.description}</p>
                      </div>
                      <p className="text-[8px] text-white/10 font-black uppercase tracking-widest shrink-0">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: false }).replace('about ', '').replace('less than a minute', 'now')}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center opacity-10">
                    <Clock className="w-12 h-12 mb-4" />
                    <p className="text-[8px] font-black uppercase tracking-widest italic text-center">Awaiting tactical events...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
