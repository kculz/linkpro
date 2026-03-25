import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreVertical
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
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Manage your properties and projects from a single, powerful platform.</p>
          </div>
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
            <span className="text-xl leading-none">+</span> New Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.color + " w-12 h-12 rounded-xl flex items-center justify-center text-white"}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-xs font-bold">
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 text-blue-500" />}
                  <span className={stat.trend === 'up' ? 'text-emerald-500' : 'text-blue-500'}>{stat.change}</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Placeholder for Projects & Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Active Projects</h3>
                <button className="text-sm font-semibold text-primary hover:underline">View All</button>
              </div>
              <div className="p-6">
                <p className="text-slate-400 text-center py-12 italic">Project management module initializing...</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-center p-6">
              <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="flex flex-col gap-4 text-left">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:bg-white transition-colors">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Rent payment received</p>
                      <p className="text-xs text-slate-500">Maria Garcia • Sunset A-101</p>
                    </div>
                    <p className="text-xs text-slate-400">2h ago</p>
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
