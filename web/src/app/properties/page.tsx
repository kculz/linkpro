import DashboardLayout from "@/components/layout/DashboardLayout";
import { Building2, Users, TrendingUp, Plus, MapPin } from 'lucide-react';
import Image from 'next/image';

const properties = [
  {
    id: '1',
    name: 'Sunset Villas',
    address: '123 Main St',
    city: 'Anytown, CA',
    type: 'Residential',
    typeColor: 'bg-emerald-100 text-emerald-700',
    totalUnits: 12,
    occupiedUnits: 11,
    occupancy: 92,
    monthlyIncome: 24600,
    status: 'ACTIVE',
    image: '/images/apartment-pool.png',
  },
  {
    id: '2',
    name: 'Metro Office Building',
    address: '456 Business Ave',
    city: 'Anytown, CA',
    type: 'Commercial',
    typeColor: 'bg-blue-100 text-blue-700',
    totalUnits: 8,
    occupiedUnits: 8,
    occupancy: 100,
    monthlyIncome: 34500,
    status: 'ACTIVE',
    image: '/images/commercial-office.png',
  },
  {
    id: '3',
    name: 'Greenwood Renovation Project',
    address: '789 Oak St',
    city: 'Anytown, CA',
    type: 'Renovation',
    typeColor: 'bg-amber-100 text-amber-700',
    totalUnits: 5,
    occupiedUnits: 0,
    occupancy: 0,
    monthlyIncome: 0,
    status: 'MAINTENANCE',
    image: '/images/renovation-site.png',
  },
];

export default function PropertiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Properties</h1>
            <p className="text-slate-500 mt-1">Manage your entire property portfolio.</p>
          </div>
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Properties', value: '24', icon: Building2, color: 'text-blue-500 bg-blue-50' },
            { label: 'Active Tenants', value: '18', icon: Users, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Monthly Income', value: '$245K', icon: TrendingUp, color: 'text-amber-500 bg-amber-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-slate-100 rounded-xl p-1 w-fit">
          {['All Properties', 'Residential', 'Commercial', 'Due for Rent'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${i === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${property.typeColor}`}>
                  {property.type}
                </span>
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${property.status === 'ACTIVE' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                  {property.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg">{property.name}</h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{property.address}, {property.city}</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Occupancy</span>
                    <span className="font-bold text-slate-900">{property.occupancy}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${property.occupancy}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">{property.occupiedUnits}/{property.totalUnits} units</p>
                    </div>
                    <p className="font-bold text-slate-900 text-lg">
                      ${property.monthlyIncome.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span>
                    </p>
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
