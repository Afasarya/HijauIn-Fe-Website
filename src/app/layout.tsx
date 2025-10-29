import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "./globals.css";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { DynamicLayout } from "@/components/layout/dynamic-layout";

export const metadata: Metadata = {
  title: "HijauIn Admin Panel",
  description: "Professional enterprise-grade admin dashboard for HijauIn - Eco-tech waste management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased bg-[#0a0a0a] text-foreground"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
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
        </SidebarProvider>
      </body>
    </html>
  );
}
