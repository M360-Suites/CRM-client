"use client";

import { MailIcon, InboxIcon, Mail } from "lucide-react";
import AuthorisationPage from "./authorisation_layout";
import MailAuthorisation from "./mail/page";
import { CustomButton } from "@/components/custom/common/customButton";
import MailPage from "./mail/page";
import { useState } from "react";

const InboxTabs = [
  {
    name: "All",
    icon: InboxIcon,
    value: "All",
  },
  {
    name: "Mail",
    icon: MailIcon,
    value: MailPage,
  },
];

export default function Body() {
  const [selectedTab, setSelectedTab] = useState("All");
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="flex flex-col gap-1 px-2.5 py-5 w-75 border border-[#E8E8E8] rounded-[12px]">
        {InboxTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setSelectedTab(tab.name)}
            className={`flex items-center gap-4 p-4 rounded-[10px] cursor-pointer ${selectedTab === tab.name ? "bg-[#FFD9C0] hover:bg-[#FFD9C0]" : "hover:bg-gray-50"}`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="w-full col-span-3 border border-[#E8E8E8] rounded-[12px] p-5 flex flex-col gap-6">
        {selectedTab === "Mail" && (
          <AuthorisationPage
            label="Allow access to Gmail"
            trigger={
              <CustomButton
                variant={"ghost"}
                className="py-2.5 px-6 rounded-full "
              >
                Authorise Gmail
              </CustomButton>
            }
          >
            {(close) => <MailAuthorisation />}
          </AuthorisationPage>
        )}
      </div>
    </div>
  );
}
