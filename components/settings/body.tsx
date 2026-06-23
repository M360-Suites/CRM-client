"use client";

import { useState, useEffect } from "react";
import Profile from "./profile/page";
import RolesAccess from "./roles/page";
import Staffs from "./staffs/page";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const Tabs = [
  { name: "Profile", value: "profile", component: Profile },
  { name: "Roles & Permissions", value: "roles", component: RolesAccess },
  {name: "Staffs", value: "staffs", component: Staffs},
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
  }, []);

  const handleTabChange = (value: string) => {
    router.push(`${pathname}?tab=${value}`);
  };

  const ActiveComponent = Tabs.find((t) => t.value === activeTab)?.component;

  return (
    <div>
      <div className={`flex items-center gap-3 sticky border-b`}>
        {Tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
            className={`${activeTab === t.value ? "border-b-2 border-b-[#C95C47] rounded-none text-black" : "hover:text-black"} px-10 py-3 cursor-pointer`}
          >
            <h3 className="text-sm font-medium">{t.name}</h3>
          </button>
        ))}
      </div>
      <div className="pt-4">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
}
