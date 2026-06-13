"use client";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDashStore } from "@/stores/dash/dashboard_store";
import {
  LayoutGrid,
  Users,
  Building2,
  SquareKanban,
  CalendarCheck,
  Inbox,
  FileText,
  Mail,
  Sparkles,
  ChartColumn,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { CustomButton } from "../custom/common/customButton";
import { useLogout } from "@/hooks/auth/logout";
import CRMLOGO from "@/public/assets/company/logo.png";

const sideLinks = [
  {
    name: "Dashboard",
    icon: LayoutGrid,
    url: "/dashboard",
  },
  {
    name: "Contacts",
    icon: Users,
    url: "/contacts",
  },
  {
    name: "Companies",
    icon: Building2,
    url: "/companies",
  },
  {
    name: "Pipelines",
    icon: SquareKanban,
    url: "/pipeline",
  },
  {
    name: "Task & Calendar",
    icon: CalendarCheck,
    url: "/tasks_and_calendar",
  },
  {
    name: "Inbox",
    icon: Inbox,
    url: "/inbox",
  },
  {
    name: "Documents",
    icon: FileText,
    url: "/documents",
  },
  // {
  //   name: "Email Sync",
  //   icon: Mail,
  //   url: ""
  // },
  {
    name: "AI Writer",
    icon: Sparkles,
    url: "/ai-writer",
  },
  {
    name: "Analytics",
    icon: ChartColumn,
    url: "/analytics",
  },
  {
    name: "Report",
    icon: ChartColumn,
    url: "/report",
  },
];

export function AppSidebar() {
  const { mutate: logoutUser, isPending } = useLogout();
  const router = useRouter();
  const { activeLink, setActiveLink } = useDashStore();
  const currentPath = usePathname();

  const { isMobile, setOpen, setOpenMobile } = useSidebar();

  useEffect(() => {
    const matchedLink = sideLinks.find((link) =>
      currentPath?.startsWith(link.url),
    );
    if (matchedLink) {
      setActiveLink(matchedLink.url);
    }
  }, [currentPath, setActiveLink]);
  return (
    <Sidebar className="inset-0 h-full overflow-y-auto">
      <SidebarHeader className="lg:pt-15 pt-5 max-lg:px-7 flex items-start justify-start">
        <Image
          src={CRMLOGO}
          alt="crm_logo"
          width={800}
          height={800}
          className="lg:hidden h-11 w-auto object-contain"
        />
      </SidebarHeader>
      <SidebarContent className="flex justify-start items-center">
        <SidebarGroup className="flex items-center gap-2">
          {sideLinks.map((link, index) => (
            <SidebarMenuButton
              key={index}
              className={` hover:bg-[#FAF1EB] [&_svg]:size-5 ${activeLink === link.url && "bg-[#FFE4D1] hover:bg-[#FFE4D1] [&_svg]:size-3"}`}
              onClick={() => {
                setActiveLink(link.url);
                router.push(`${link.url}`);
                if (isMobile) {
                  setOpenMobile(false);
                }
              }}
            >
              {activeLink === link.url ? (
                <svg
                  width="4"
                  height="4"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4" r="4" fill="#C95C47" />
                </svg>
              ) : (
                <link.icon
                  className="h-5 w-5"
                  color={activeLink === link.url ? "#3A2418" : "#4a4a4a"}
                />
              )}
              <span
                className={`${activeLink === link.url ? "text-[#C95C47] text-sm font-medium" : "text-foreground text-sm"}`}
              >
                {link.name}
              </span>
            </SidebarMenuButton>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-10 px-5 bg-transparent">
        <CustomButton
          variant="ghost"
          onClick={() => {
            logoutUser();
          }}
          className="px-5 py-4 flex items-center border-none justify-start flex-row gap-4"
        >
          <LogOut className="h-6 w-6" color={"#3A2418"} />
          <span className="text-base font-medium text-[#3A2418]">
            {isPending ? "Logging out..." : "Log out"}
          </span>
        </CustomButton>
      </SidebarFooter>
    </Sidebar>
  );
}
