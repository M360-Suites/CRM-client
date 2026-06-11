"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app_sidebar";
import Navbar from "@/components/dashboard/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex flex-col inset-0 font-inter">
      <Navbar />
      <div className="flex w-full">
        <AppSidebar />
        <main className="pt-16 xl:px-8 px-4 lg:px-5 w-full">
          <SidebarTrigger className="" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
