"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store";
import { AppSidebarContainer } from "@/components/layout/app-sidebar";
import type { AppLayoutProps } from "./app-layout.interface";

export function AppLayout({ children }: AppLayoutProps) {
  const { openSidebar } = useUIStore();

  return (
    <div className="flex h-screen bg-[#F6F5F4]">
      {/* Sidebar */}
      <AppSidebarContainer />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={openSidebar}
            className="text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
            <span className="text-xl font-bold text-gray-900">Auphere</span>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-auto bg-[#F6F5F4]">{children}</main>
      </div>
    </div>
  );
}
