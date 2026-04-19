'use client';

import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import { useUIStore } from "@/store/ui.store";
import { clsx } from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <Sidebar />
      
      <main className={clsx(
        "flex flex-col min-h-screen transition-all duration-300",
        "lg:pl-64", // Fixed padding on desktop
      )}>
        <Header />
        <div className="p-4 md:p-8 flex-1 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
