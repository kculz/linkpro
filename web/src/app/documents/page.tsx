'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  MoreVertical,
  Loader2,
  FolderOpen,
  FileCode,
  FileCheck,
  FileSignature,
  FileImage,
  ArrowUpRight,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { useDocumentStore } from '@/store/document.store';
import UploadDocumentModal from '@/components/documents/UploadDocumentModal';
import { clsx } from 'clsx';
import { format } from 'date-fns';

const CATEGORIES = [
  { id: 'LEASE', label: 'Lease Agreements', icon: FileSignature, color: 'text-primary' },
  { id: 'RECEIPT', label: 'Financial Receipts', icon: FileCheck, color: 'text-emerald-500' },
  { id: 'BLUEPRINT', label: 'Blueprints & Technical', icon: FileCode, color: 'text-amber-500' },
  { id: 'CONTRACT', label: 'Legal Contracts', icon: ShieldCheck, color: 'text-indigo-500' },
  { id: 'ID', label: 'Identity Documents', icon: FileImage, color: 'text-slate-400' },
];

export default function DocumentsPage() {
  const { documents, loading, fetchDocuments, deleteDocument } = useDocumentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || doc.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSize = documents.reduce((acc, doc) => acc + doc.fileSize, 0);
  const totalSizeFormatted = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Asset Vault</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Secure Documentation • Historical Integrity Storage</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
          >
            <Upload className="w-5 h-5" /> Deposit Asset
          </button>
        </div>

        {/* Vault Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-1">Total Artifacts</p>
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{documents.length}</p>
            </div>
          </div>
          <div className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <HardDrive className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-1">Vault Utilization</p>
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{totalSizeFormatted}</p>
            </div>
          </div>
          <div className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/[0.01] pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-1">Security Level</p>
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase">AES-256</p>
            </div>
          </div>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveCategory(null)}
              className={clsx(
                "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all border",
                !activeCategory ? "bg-white/5 border-white/10 text-white shadow-lg" : "text-white/20 border-transparent hover:text-white/40"
              )}
            >
              All Assets
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all border flex items-center gap-2",
                  activeCategory === cat.id ? "bg-white/5 border-white/10 text-white shadow-lg" : "text-white/20 border-transparent hover:text-white/40"
                )}
              >
                <cat.icon className={clsx("w-3.5 h-3.5", activeCategory === cat.id ? cat.color : "text-current")} />
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Query vault metadata..."
              className="w-full bg-surface/40 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Document Grid */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center opacity-20">
            <Loader2 className="w-12 h-12 animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Decrypting Secure Vault...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-surface/30 rounded-[3rem] border border-white/[0.03] p-32 text-center opacity-40">
            <FileText className="w-16 h-16 mx-auto mb-6 text-white/10" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">No operational artifacts found matching query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
            {filteredDocs.map((doc) => {
              const CategoryIcon = CATEGORIES.find(c => c.id === doc.type)?.icon || FileText;
              const categoryColor = CATEGORIES.find(c => c.id === doc.type)?.color || 'text-white/20';
              
              return (
                <div key={doc.id} className="group bg-surface/40 rounded-[2.5rem] border border-white/[0.03] hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl relative p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className={clsx("w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-inner transition-all group-hover:scale-110", categoryColor)}>
                      <CategoryIcon className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-white/5 rounded-xl text-white/10 hover:text-white transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 hover:bg-status-error/10 rounded-xl text-white/10 hover:text-status-error transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <h4 className="text-sm font-black text-white italic uppercase tracking-tighter leading-relaxed group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">{doc.name}</h4>
                    
                    <div className="pt-4 border-t border-white/[0.03] space-y-3">
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest italic text-white/20">
                        <span>Type</span>
                        <span className="text-white/60">{doc.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest italic text-white/20">
                        <span>Size</span>
                        <span className="text-white/60">{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest italic text-white/20">
                        <span>Deposited</span>
                        <span className="text-white/60">{format(new Date(doc.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-white/10 group-hover:text-white/30 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[8px] font-black uppercase italic border border-white/5">
                            {doc.uploader?.name.charAt(0)}
                          </div>
                          <span className="text-[9px] font-bold italic lowercase">{doc.uploader?.name}</span>
                       </div>
                       <ArrowUpRight className="w-3.5 h-3.5 text-white/5 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <UploadDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
