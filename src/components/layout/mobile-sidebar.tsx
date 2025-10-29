"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Auto close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#171717] p-2 text-white lg:hidden border border-white/10 shadow-lg hover:bg-[#222222] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Container */}
      {isOpen && (
        <div className="fixed left-0 top-0 z-60 h-screen w-64 lg:hidden">
          {/* Sidebar Content */}
          <div
            className={`h-full transition-transform duration-300 ease-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar onClose={() => setIsOpen(false)} />
          </div>
          
          {/* Close Button - Always on top */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-70 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors shadow-lg backdrop-blur-sm border border-white/20"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
