"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "./sidebar-context";

export function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 gap-3">
        {/* Desktop Toggle + Search */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
          {/* Toggle Button for Desktop */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search - Hidden on very small screens */}
          <div className="relative flex-1 hidden xs:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-white/10"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Icon for Mobile */}
          <button className="xs:hidden rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0a0a0a]"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 sm:gap-3 rounded-lg border border-white/10 bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 transition-colors hover:bg-white/10"
            >
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs sm:text-sm font-semibold text-white">
                A
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-white">Admin</span>
                <span className="text-xs text-gray-400">Super Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-40 md:hidden" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#171717] shadow-xl z-50">
                  <div className="p-2">
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                      Profile Settings
                    </button>
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                      Account
                    </button>
                    <div className="my-1 h-px bg-white/10"></div>
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
