import DashboardLayout from "@/components/layout/DashboardLayout";
import { Plus, Calendar, DollarSign } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    id: '1',
    name: 'Riverside Apartments',
    description: 'New 50-unit residential complex',
    status: 'IN_PROGRESS',
    statusLabel: 'In Progress',
    statusColor: 'bg-blue-100 text-blue-700',
    progress: 65,
    progressColor: 'bg-blue-500',
    budget: '$3.2M',
    dueDate: 'Dec 15, 2024',
    image: '/images/apartment-pool.png',
  },
  {
    id: '2',
    name: 'Downtown Office Renovation',
    description: 'Commercial space renovation',
    status: 'ON_TRACK',
    statusLabel: 'On Track',
    statusColor: 'bg-emerald-100 text-emerald-700',
    progress: 40,
    progressColor: 'bg-emerald-500',
    budget: '$1.8M',
    dueDate: 'Nov 30, 2024',
    image: '/images/renovation-site.png',
  },
  {
    id: '3',
    name: 'Greenwood Commerce Hub',
    description: 'Mixed-use commercial development',
    status: 'PLANNING',
    statusLabel: 'Planning',
    statusColor: 'bg-amber-100 text-amber-700',
    progress: 10,
    progressColor: 'bg-amber-500',
    budget: '$5.5M',
    dueDate: 'Mar 20, 2025',
    image: '/images/commercial-office.png',
  },
];

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
            <p className="text-slate-500 mt-1">Track all development and renovation projects.</p>
          </div>
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {/* Projects List */}
        <div className="space-y-5">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex gap-5 group cursor-pointer">
              <div className="w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={project.image} alt={project.name} width={112} height={96} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{project.name}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{project.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.statusColor}`}>
                    {project.statusLabel}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-bold text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className={`${project.progressColor} h-2.5 rounded-full transition-all`} style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="flex gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Due {project.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span>{project.budget} budget</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
