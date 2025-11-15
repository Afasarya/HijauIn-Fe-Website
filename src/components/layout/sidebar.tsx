"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MapPin,
  FileText,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import Image from "next/image";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "User Management",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    label: "Transactions Management",
    icon: CreditCard,
    href: "/dashboard/transactions",
  },
  {
    label: "Lokasi Sampah",
    icon: MapPin,
    href: "/dashboard/waste-locations",
  },
  {
    label: "Artikel Management",
    icon: FileText,
    href: "/dashboard/articles",
  },
  {
    label: "Product Categories",
    icon: Package,
    href: "/dashboard/product-categories",
  },
  {
    label: "Product Management",
    icon: Package,
    href: "/dashboard/products",
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#171717] border-r border-white/10 transition-all duration-300",
        isCollapsed ? "w-16 sm:w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          "flex h-14 sm:h-16 items-center border-b border-white/10",
          isCollapsed ? "justify-center px-3" : "justify-between px-4 sm:px-6"
        )}>
          <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/images/logo.svg"
                alt="HijauIn Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-semibold text-white">HijauIn</span>
              <span className="text-xs text-gray-400">Admin Panel</span>
            </div>
          </div>
          
          {/* Collapsed Logo */}
          <div className={cn("hidden", isCollapsed && "flex items-center justify-center")}>
            <div className="relative w-8 h-8">
              <Image
                src="/images/logo.svg"
                alt="HijauIn Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Toggle Button - Hidden on Mobile */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "hidden lg:flex rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white",
              isCollapsed && "absolute right-2"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 sm:p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 touch-manipulation",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={cn("transition-opacity text-sm", isCollapsed && "hidden")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Settings (pinned at bottom) */}
        <div className="border-t border-white/10 p-3 sm:p-4">
          <Link
            href="/dashboard/settings"
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 touch-manipulation",
              pathname === "/dashboard/settings"
                ? "bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span className={cn("text-sm transition-opacity", isCollapsed && "hidden")}>
              Settings
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
