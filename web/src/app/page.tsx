'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, ArrowRight, Stars, Shield, Users, Hammer, Paintbrush } from 'lucide-react';

const FEATURES = [
  {
    title: 'Property Management',
    description: 'Bespoke management for your residential and commercial portfolios.',
    icon: Building2,
  },
  {
    title: 'Development Projects',
    description: 'Precision oversight for ground-up developments and expansions.',
    icon: Stars,
  },
  {
    title: 'In-House Renovations',
    description: 'High-end transformations and structural updates, executed by our own team.',
    icon: Paintbrush,
  },
  {
    title: 'Proactive Maintenance',
    description: 'Curated maintenance schedules to preserve and enhance property value.',
    icon: Hammer,
  },
];

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-semibold tracking-tight">LinkPro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              <a href="#services" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Services</a>
              <a href="#about" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Philosophy</a>
              <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link>
              <Link href="/register" className="text-sm font-semibold px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold tracking-widest uppercase mb-8">
              Excellence in Management
            </span>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-slate-900 mb-8 leading-[1.05]">
              Seamless management for <span className="font-medium italic">visionary</span> owners.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              LinkPro orchestrates your properties and development projects with surgical precision. 
              From structural renovations to daily maintenance—all expertly handled by our in-house team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register" className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-medium rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Register as Owner <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-4 bg-white text-slate-600 font-medium rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
                Login to Portal
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="max-w-6xl mx-auto px-6 mt-24"
        >
          <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200">
            <Image 
              src="/images/apartment-pool.png" 
              alt="Luxury Property Portfolio" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-6">Our Services</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                We go beyond traditional management. We are your partners in growth, protection, 
                and the physical upkeep of your most valuable assets.
              </p>
            </div>
            <div className="text-sm font-semibold text-slate-400 tracking-widest uppercase">
              Done In-House
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1px bg-slate-100 border border-slate-100 rounded-[2rem] overflow-hidden">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-white p-10 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center mb-8 group-hover:bg-white transition-colors">
                  <feature.icon className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Philosophy */}
      <section id="about" className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[2rem] overflow-hidden shadow-inner">
                <Image 
                  src="/images/renovation-site.png" 
                  alt="Quality Craftsmanship" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 aspect-square bg-white p-4 rounded-3xl shadow-2xl hidden md:block border border-slate-50">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                   <Image 
                    src="/images/commercial-office.png" 
                    alt="Corporate Detail" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h2 className="text-4xl font-light leading-tight">
                A commitment to <br /> <span className="font-medium italic text-primary">absolute longevity</span>.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                We believe that great management is invisible but its effects are profound. 
                By handling renovations and maintenance in-house, we ensure the highest 
                standard of quality without the friction of third-party coordination.
              </p>
              
              <div className="space-y-6">
                {[
                  'Single point of contact for all property needs.',
                  'Direct supervision of every development stage.',
                  'Transparent reporting with owners in mind.',
                  'Heritage-quality maintenance and care.',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-slate-900" />
                    <span className="text-slate-600 font-medium italic">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link href="/register" className="inline-flex items-center gap-2 group text-slate-900 font-semibold">
                  Partner with LinkPro <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-20 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Building2 className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-semibold tracking-tight">LinkPro</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-xs">
                A boutique management experience for discerning property owners and developers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-20 md:col-span-2">
              <div className="space-y-6">
                <h4 className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Company</h4>
                <div className="flex flex-col gap-4 text-sm font-medium text-slate-500">
                  <a href="#" className="hover:text-slate-900 transition-colors">Philosophy</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">Services</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">Legal</h4>
                <div className="flex flex-col gap-4 text-sm font-medium text-slate-500">
                  <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} LinkPro. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-slate-900 transition-colors">Instagram</a>
              <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
