"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app_sidebar";
import Navbar from "@/components/dashboard/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex flex-col font-inter">
      <Navbar /> {/* sticky top-0, with <SidebarTrigger /> inside it */}
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 min-w-0 py-14 xl:px-8 px-5">{children}</main>
      </div>
    </SidebarProvider>
  );
}
