import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 flex flex-col min-h-screen">
        <Header />
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
