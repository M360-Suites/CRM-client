"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app_sidebar";
import Navbar from "@/components/dashboard/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex flex-col inset-0 font-inter">
      <Navbar />
      <div className="flex">
        <AppSidebar />
        <SidebarTrigger className="md:hidden" />
        <main className="pt-16 px-8 w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
