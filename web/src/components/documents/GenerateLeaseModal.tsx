'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, FileSignature, Save, ChevronRight, CheckCircle2, AlertCircle, Building2, User, Calendar, DollarSign } from 'lucide-react';
import { useTemplateStore } from '@/store/template.store';
import { useDocumentStore } from '@/store/document.store';
import { usePropertyStore } from '@/store/property.store';
import { useTenantStore } from '@/store/tenant.store';
import { clsx } from 'clsx';

interface GenerateLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateLeaseModal({ isOpen, onClose }: GenerateLeaseModalProps) {
  const { templates, fetchTemplates } = useTemplateStore();
  const { addDocument } = useDocumentStore();
  const { properties, fetchProperties } = usePropertyStore();
  const { tenants, fetchTenants } = useTenantStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    landlord_name: 'LinkPro Asset Management',
    tenant_name: '',
    property_address: '',
    unit_number: '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    security_deposit: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchProperties();
      fetchTenants();
    }
  }, [isOpen, fetchTemplates, fetchProperties, fetchTenants]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 1 && !selectedTemplate) return;
    setStep(step + 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Basic placeholder replacement
      let finalContent = selectedTemplate.content;
      Object.entries(formData).forEach(([key, value]) => {
        finalContent = finalContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
      finalContent = finalContent.replace('{{current_date}}', new Date().toLocaleDateString());

      // Save as a document
      await addDocument({
        name: `Lease - ${formData.tenant_name} - ${new Date().getFullYear()}`,
        type: 'LEASE',
        targetType: 'PROPERTY',
        // In a real app, we'd convert the HTML to PDF on the server
        fileUrl: `https://vault.linkpro.ai/generated/${Date.now()}_lease.pdf`,
        fileType: 'application/pdf',
        fileSize: 1024 * 250, // Mock size
        metadata: { isGenerated: true, templateId: selectedTemplate.id, variables: formData }
      } as any);

      onClose();
      setStep(1);
      setSelectedTemplate(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface border border-white/[0.05] rounded-[3rem] w-full max-w-4xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-10 border-b border-white/[0.03] relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Create Agreement</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Generate legal documents from templates</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Steps Breadcrumbs */}
        <div className="px-10 py-6 border-b border-white/[0.03] flex items-center gap-6 relative z-10 shrink-0">
          {[
            { id: 1, label: 'Select Template' },
            { id: 2, label: 'Fill Details' },
            { id: 3, label: 'Review & Generate' }
          ].map(s => (
            <div key={s.id} className="flex items-center gap-4">
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black italic border transition-all",
                step === s.id ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : 
                step > s.id ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-white/20"
              )}>
                {step > s.id ? '✓' : s.id}
              </div>
              <span className={clsx("text-[10px] font-black uppercase tracking-widest italic", step >= s.id ? "text-white" : "text-white/10")}>{s.label}</span>
              {s.id < 3 && <ChevronRight className="w-4 h-4 text-white/5" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-10 relative z-10">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-left-4 duration-300">
              {templates.length === 0 ? (
                 <div className="col-span-2 py-20 text-center opacity-20">
                    <FileSignature className="w-16 h-16 mx-auto mb-6" />
                    <p className="text-xs font-black uppercase italic tracking-widest">No templates found. Please seed default templates in system settings.</p>
                 </div>
              ) : templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={clsx(
                    "p-8 rounded-[2.5rem] border text-left transition-all group relative overflow-hidden",
                    selectedTemplate?.id === t.id ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "bg-white/[0.02] border-white/[0.05] hover:border-white/20"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all",
                    selectedTemplate?.id === t.id ? "bg-primary text-white" : "bg-white/5 text-white/20 group-hover:bg-primary/20 group-hover:text-primary"
                  )}>
                    <FileSignature className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">{t.name}</h3>
                  <p className="text-[10px] text-white/20 font-bold italic leading-relaxed uppercase tracking-widest">{t.description}</p>
                  
                  {selectedTemplate?.id === t.id && (
                    <div className="absolute top-8 right-8">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Form Details */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic mb-8">Participant Information</h3>
                <div>
                  <label className="block text-[9px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Tenant Name
                  </label>
                  <select
                    className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] text-white font-bold italic text-sm outline-none focus:border-primary/50 transition-all appearance-none"
                    value={formData.tenant_name}
                    onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
                  >
                    <option value="" className="bg-surface">Select Tenant...</option>
                    {tenants.map(tn => <option key={tn.id} value={tn.name} className="bg-surface">{tn.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> Property Asset
                  </label>
                  <select
                    className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] text-white font-bold italic text-sm outline-none focus:border-primary/50 transition-all appearance-none"
                    value={formData.property_address}
                    onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  >
                    <option value="" className="bg-surface">Select Property...</option>
                    {properties.map(p => <option key={p.id} value={p.address} className="bg-surface">{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> Unit Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 402"
                    className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] text-white font-bold italic text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/5"
                    value={formData.unit_number}
                    onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic mb-8">Financial & Term Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] text-white font-bold italic text-sm outline-none focus:border-primary/50 transition-all"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> End Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] text-white font-bold italic text-sm outline-none focus:border-primary/50 transition-all"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" /> Monthly Rent
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $1,200.00"
                    className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] text-white font-bold italic text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/5"
                    value={formData.monthly_rent}
                    onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" /> Security Deposit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $1,200.00"
                    className="w-full bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] text-white font-bold italic text-sm outline-none focus:border-primary/50 transition-all placeholder:text-white/5"
                    value={formData.security_deposit}
                    onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="animate-in zoom-in-95 duration-300">
               <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-10 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileSignature className="w-32 h-32" />
                  </div>
                  
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                     <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Confirm Agreement Details
                  </h3>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                     {[
                       { label: 'Template', value: selectedTemplate.name },
                       { label: 'Tenant', value: formData.tenant_name },
                       { label: 'Property', value: formData.property_address },
                       { label: 'Unit', value: formData.unit_number },
                       { label: 'Term', value: `${formData.start_date} to ${formData.end_date}` },
                       { label: 'Monthly Rent', value: formData.monthly_rent },
                     ].map(item => (
                       <div key={item.label} className="border-b border-white/[0.03] pb-4">
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic mb-1">{item.label}</p>
                          <p className="text-sm font-black text-white italic uppercase tracking-tight">{item.value || 'N/A'}</p>
                       </div>
                     ))}
                  </div>

                  <div className="mt-12 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Save className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-xs font-black text-white italic uppercase tracking-tight">Ready to Generate</p>
                        <p className="text-[9px] text-white/20 font-bold italic uppercase">This will create a new PDF record in your Documents</p>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-10 border-t border-white/[0.03] flex items-center justify-between relative z-10 shrink-0">
          <button
            onClick={() => step === 1 ? onClose() : setStep(step - 1)}
            className="px-8 py-4 rounded-2xl font-black italic uppercase text-[10px] tracking-widest text-white/20 hover:bg-white/5 transition-all"
          >
            {step === 1 ? 'Cancel' : 'Go Back'}
          </button>
          
          <button
            disabled={loading || (step === 1 && !selectedTemplate)}
            onClick={step === 3 ? handleGenerate : handleNextStep}
            className="px-10 py-4 bg-primary text-white rounded-2xl font-black italic uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:brightness-110 transition-all flex items-center gap-3 border border-primary/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                {step === 3 ? 'Generate Agreement' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
