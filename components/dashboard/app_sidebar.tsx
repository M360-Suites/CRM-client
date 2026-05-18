"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
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
  Sparkle,
  ChartColumn,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

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
    url: "/calendar",
  },
  // {
  //   name: "Inbox",
  //   icon: Inbox,
  //   url: ""
  // },
  // {
  //   name: "Documents",
  //   icon: FileText,
  //   url: ""
  // },
  // {
  //   name: "Email Sync",
  //   icon: Mail,
  //   url: ""
  // },
  // {
  //   name: "AI Writer",
  //   icon: Sparkle,
  //   url: ""
  // },
  // {
  //   name: "Analytics",
  //   icon: ChartColumn,
  //   url: ""
  // },
  // {
  //   name: "Report",
  //   icon: ChartColumn,
  //   url: ""
  // }
];

export function AppSidebar() {
  const router = useRouter();
  const { activeLink, setActiveLink } = useDashStore();
  const currentPath = usePathname();

  useEffect(() => {
    const matchedLink = sideLinks.find((link) =>
      currentPath.startsWith(link.url),
    );
    if (matchedLink) {
      setActiveLink(matchedLink.url);
    }
  }, [setActiveLink]);
  return (
    <Sidebar className="inset-0 h-full overflow-y-auto">
      <SidebarHeader className="pt-15" />
      <SidebarContent className="flex justify-start items-center">
        <SidebarGroup className="flex items-center gap-2">
          {sideLinks.map((link, index) => (
            <SidebarMenuButton
              key={index}
              className={` hover:bg-[#FAF1EB] [&_svg]:size-5 ${activeLink === link.url && "bg-[#FFE4D1] hover:bg-[#FFE4D1] [&_svg]:size-3"}`}
              onClick={() => {
                setActiveLink(link.url);
                router.push(`${link.url}`);
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
                <link.icon className="h-5 w-5" color={"#3A2418"} />
              )}
              <span
                className={`${activeLink === link.url ? "text-[#C95C47] text-sm font-medium" : "text-gray text-sm"}`}
              >
                {link.name}
              </span>
            </SidebarMenuButton>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
