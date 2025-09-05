import { Header } from "@/components/dashboard/Header";
import { UsageProvider } from "@/components/dashboard/UsageContext";

export default function DashboardLayout({ children }) {
  return (
    <UsageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </UsageProvider>
  );
}
