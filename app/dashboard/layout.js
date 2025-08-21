import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
