"use client";

import { useEffect } from "react";
import Profile from "./profile/page";
import RolesAccess from "./roles/page";
import Staffs from "./staffs/page";
import LeadCaptureSettings from "./lead/page";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const Tabs = [
  { name: "Profile", value: "profile", component: Profile },
  { name: "Roles & Permissions", value: "roles", component: RolesAccess },
  { name: "Staffs", value: "staffs", component: Staffs },
  { name: "Leads", value: "leads", component: LeadCaptureSettings },
];

export default function Body() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tab = searchParams.get("tab") ?? "profile";
  const activeTab = Tabs.find((t) => t.value === tab) ? tab : "profile";

  // Ensure URL always has ?tab= on first load
  useEffect(() => {
    if (!searchParams.get("tab")) {
      router.replace(`${pathname}?tab=profile`);
    }
  }, [pathname, searchParams, router]);

  const handleTabChange = (value: string) => {
    router.push(`${pathname}?tab=${value}`);
  };

  const ActiveComponent = Tabs.find((t) => t.value === activeTab)?.component;

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-3 max-md:gap-2 sticky border-b border-b-gray-200`}
      >
        {Tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
            className={`${activeTab === t.value ? "border-b-3 border-b-[#4a0f0a] rounded-none text-black" : "hover:text-black"} px-10 max-md:px-4 py-3 cursor-pointer`}
          >
            <h3 className="text-sm max-md:text-xs font-medium">{t.name}</h3>
          </button>
        ))}
      </div>
      <div className="pt-4 w-full">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
