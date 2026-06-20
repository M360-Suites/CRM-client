"use client";

import { useState, useEffect } from "react";
import Profile from "./profile/page";
import RolesAccess from "./roles/page";
import { CustomButton } from "../custom/common/customButton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const Tabs = [
  { name: "Profile", value: "profile", component: Profile },
  { name: "Roles and Permissions", value: "roles", component: RolesAccess },
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
      <div className={`flex items-center gap-3 sticky`}>
        {Tabs.map((t) => (
          <CustomButton
            key={t.value}
            variant="link"
            onClick={() => handleTabChange(t.value)}
            className={`${activeTab === t.value && "border-b border-b-[#C95C47] rounded-none"} px-10 py-3 no-underline`}
          >
            <h3 className="no-underline">{t.name}</h3>
          </CustomButton>
        ))}
      </div>

      <div className="pt-6">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
}
