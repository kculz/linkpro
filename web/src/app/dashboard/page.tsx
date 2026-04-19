import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreVertical,
  Plus
} from 'lucide-react';

const stats = [
  { label: 'Active Projects', value: '12', change: '+2', trend: 'up', icon: Briefcase, color: 'bg-blue-500' },
  { label: 'Properties', value: '24', change: '+3', trend: 'up', icon: Building2, color: 'bg-emerald-500' },
  { label: 'Active Tenants', value: '18', change: '2 renewals', trend: 'info', icon: Users, color: 'bg-indigo-500' },
  { label: 'Monthly Rent', value: '$245K', change: '+12%', trend: 'up', icon: TrendingUp, color: 'bg-amber-500' },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Dashboard Overview</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Command and Control • Real-time Portfolio Intel</p>
          </div>
          <button className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20">
            <Plus className="w-5 h-5" /> Initialize Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl hover:border-white/10 transition-all group overflow-hidden relative">
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.color}/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={stat.color + " w-14 h-14 rounded-2xl flex items-center justify-center text-white border border-current shadow-[0_0_15px_rgba(0,0,0,0.3)]"}>
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
                <button className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest italic flex items-center gap-2 group/btn underline decoration-primary/30 underline-offset-4">
                  Full Intel <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="p-12">
                <div className="flex flex-col items-center justify-center text-center py-20 opacity-20 group-hover:opacity-40 transition-opacity">
                  <TrendingUp className="w-16 h-16 mb-6 text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] italic max-w-xs">Module under construction. Real-time project telemetry initializing...</p>
                </div>
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
                {[
                  { user: 'MARIA GARCIA', property: 'SUNSET A-101', type: 'PAYMENT_RECEIVED', time: '2H AGO' },
                  { user: 'JOHN MILLER', property: 'RIVERSIDE B-402', type: 'MAINTENANCE_LOCK', time: '4H AGO' },
                  { user: 'SARA SMITH', property: 'URBAN LOFT 12', type: 'LEASE_EXECUTION', time: '6H AGO' },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all cursor-pointer group/item border border-transparent hover:border-white/[0.05]">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover/item:bg-primary/20 group-hover/item:border-primary/30 transition-all shadow-inner">
                      <Clock className="w-6 h-6 text-white/10 group-hover/item:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{activity.user}</p>
                      <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1 italic">{activity.property}</p>
                    </div>
                    <p className="text-[8px] text-white/10 font-black uppercase tracking-widest">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
