import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { DynamicLayout } from "@/components/layout/dynamic-layout";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content Area with Dynamic Padding */}
      <DynamicLayout>
        <TopBar />
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </DynamicLayout>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}
