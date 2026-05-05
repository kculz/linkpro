'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, FileText, Upload, Plus, Trash2, Download, ExternalLink, FileSignature, FileCheck, FileCode, ShieldCheck, FileImage } from 'lucide-react';
import { useDocumentStore } from '@/store/document.store';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface EntityDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'PROPERTY' | 'PROJECT' | 'TENANT' | 'UNIT' | 'TRANSACTION' | 'MAINTENANCE' | 'GENERAL';
  title: string;
}

const CATEGORIES = [
  { id: 'LEASE', label: 'Lease Agreements', icon: FileSignature, color: 'text-primary' },
  { id: 'RECEIPT', label: 'Receipts', icon: FileCheck, color: 'text-emerald-500' },
  { id: 'QUOTATION', label: 'Quotations', icon: FileText, color: 'text-amber-500' },
  { id: 'INVOICE', label: 'Invoices', icon: FileCode, color: 'text-indigo-500' },
  { id: 'CONTRACT', label: 'Contracts', icon: ShieldCheck, color: 'text-blue-500' },
  { id: 'BLUEPRINT', label: 'Blueprints', icon: FileCode, color: 'text-orange-500' },
  { id: 'ID', label: 'Personal ID', icon: FileImage, color: 'text-slate-400' },
];

export default function EntityDocumentsModal({ isOpen, onClose, targetId, targetType, title }: EntityDocumentsModalProps) {
  const { documents, loading, fetchDocuments, addDocument, deleteDocument } = useDocumentStore();
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'QUOTATION',
  });

  useEffect(() => {
    if (isOpen && targetId) {
      fetchDocuments({ targetId, targetType });
    }
  }, [isOpen, targetId, targetType, fetchDocuments]);

  if (!isOpen) return null;

  const filteredDocs = documents.filter(d => d.targetId === targetId);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await addDocument({
        ...formData,
        targetId,
        targetType,
        fileUrl: `https://vault.linkpro.ai/storage/${Date.now()}_${formData.name}`,
        fileType: 'application/pdf',
        fileSize: 1024 * 1024 * 1.5 // Mock 1.5MB
      } as any);
      setShowUploadForm(false);
      setFormData({ name: '', type: 'QUOTATION' });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface border border-white/[0.05] rounded-[3rem] w-full max-w-4xl max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/[0.03] relative z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Documents: {title}</h2>
            <p className="text-white/20 text-[10px] font-bold mt-3 uppercase tracking-[0.2em] italic">Manage quotations, invoices, and files</p>
          </div>
          <div className="flex items-center gap-4">
            {!showUploadForm && (
              <button 
                onClick={() => setShowUploadForm(true)}
                className="px-6 py-3 bg-primary/10 text-primary rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-primary/20 transition-all border border-primary/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Document
              </button>
            )}
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative z-10 min-h-0">
          {showUploadForm ? (
            <div className="max-w-xl mx-auto animate-in slide-in-from-top-4 duration-300">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-white italic uppercase tracking-widest">New Document</h3>
                  <button onClick={() => setShowUploadForm(false)} className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                </div>
                
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <label className="block text-[9px] font-black text-white/20 mb-2 uppercase tracking-widest italic">Document Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Roof Repair Quotation..."
                      className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 outline-none transition-all text-white font-bold italic text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-white/20 mb-2 uppercase tracking-widest italic">Document Type</label>
                    <select
                      className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    >
                      <option value="QUOTATION" className="bg-surface">Quotation</option>
                      <option value="INVOICE" className="bg-surface">Invoice</option>
                      <option value="RECEIPT" className="bg-surface">Receipt</option>
                      <option value="CONTRACT" className="bg-surface">Contract</option>
                      <option value="LEASE" className="bg-surface">Lease Agreement</option>
                      <option value="OTHER" className="bg-surface">Other</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      disabled={uploading}
                      type="submit"
                      className="w-full py-4 bg-primary text-white rounded-2xl font-black italic uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload File
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest italic">Retrieving Files...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-32 text-center opacity-30 border-2 border-dashed border-white/[0.02] rounded-[3rem]">
              <FileText className="w-12 h-12 mx-auto mb-4 text-white/10" />
              <p className="text-[10px] font-black uppercase tracking-widest italic">No documents attached yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDocs.map((doc) => {
                const CategoryIcon = CATEGORIES.find(c => c.id === doc.type)?.icon || FileText;
                const categoryColor = CATEGORIES.find(c => c.id === doc.type)?.color || 'text-white/20';
                
                return (
                  <div key={doc.id} className="group bg-white/[0.02] rounded-3xl border border-white/[0.05] p-6 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className={clsx("w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] transition-all group-hover:scale-110", categoryColor)}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1">
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 hover:bg-white/5 rounded-lg text-white/10 hover:text-white transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 hover:bg-status-error/10 rounded-lg text-white/10 hover:text-status-error transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="text-xs font-black text-white italic uppercase tracking-tighter truncate group-hover:text-primary transition-colors mb-4">{doc.name}</h4>
                    
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest italic text-white/15">
                      <span>{doc.type}</span>
                      <span>{format(new Date(doc.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
