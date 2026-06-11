"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app_sidebar";
import Navbar from "@/components/dashboard/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex flex-col inset-0 font-inter">
      <Navbar />
      <div className="flex w-full">
        <div className="relative">
          <AppSidebar />
          <SidebarTrigger className="sticky max-md:hidden rounded-full z-80 top-20 left-60  h-10 w-10 items-center justify-center flex" />
        </div>
        <main className="pt-16 xl:px-8 px-5 lg:px-5 w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
