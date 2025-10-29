"use client";

import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

export function DynamicLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}
    >
      {children}
    </div>
  );
}
