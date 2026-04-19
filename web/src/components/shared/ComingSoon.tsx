'use client';

import React from 'react';
import { Construction, ArrowLeft, Hourglass } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 translate-y-4">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full scale-110" />
        <div className="relative w-24 h-24 bg-surface rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-black/50 border border-white/5">
          <Hourglass className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-status-success rounded-full p-2 border-4 border-[#0B0F19] shadow-lg">
          <Construction className="w-5 h-5 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 italic">
        {title} <span className="text-primary font-normal italic underline decoration-status-warning decoration-4 underline-offset-8">Incoming</span>
      </h1>
      <p className="text-white/40 max-w-md mx-auto text-lg mb-10 leading-relaxed font-normal">
        {description} We're polishing the final details to give you a premium experience.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20 group border border-white/5"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Safety
        </Link>
        <div className="px-8 py-4 border border-white/5 rounded-2xl text-white/30 font-bold bg-white/5 backdrop-blur-sm italic">
          v1.0.2 Development
        </div>
      </div>

      <div className="mt-20 grid grid-cols-3 gap-8 w-full max-w-2xl opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[80%] animate-pulse" />
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="bg-status-warning h-full w-[40%] animate-pulse delay-75" />
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="bg-primary-dark h-full w-[60%] animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
}
