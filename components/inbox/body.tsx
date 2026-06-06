"use client";

import { MailIcon, InboxIcon, Mail, Loader, CloudSync } from "lucide-react";
import { CustomButton } from "../custom/common/customButton";
import ShowMail from "./mail/show_mail";
import MailAuthorisation from "./mail/page";
import { useGmailStore } from "@/stores/gmail/gmail_store";
import { useGmailStatus } from "@/hooks/gmail/gmail_connect_status";
import { useEffect } from "react";
import MailPage from "./mail/page";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthorisationPage from "./authorisation_layout";
import { useGmailSync } from "@/hooks/gmail/gmail_sync";

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
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("channel") ?? "All";
  const tab = initialTab.charAt(0).toUpperCase() + initialTab.slice(1);
  const [selectedTab, setSelectedTab] = useState(tab);
  const { setConnectedChannels } = useGmailStore();
  const { isPending: isStatusPending, data } = useGmailStatus();
  const channel = searchParams?.get("channel");
  const status = searchParams?.get("connected");
  const { mutate: handleSync, isPending } = useGmailSync();

  useEffect(() => {
    if (channel && status) {
      setConnectedChannels([
        {
          id: channel,
          label: "Google Gmail",
          connected: (status as string) === "true",
        },
      ]);
    }
  }, [channel, status, setConnectedChannels]);

  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="flex flex-col gap-1 px-2.5 py-5 w-75 border border-[#E8E8E8] rounded-[12px]">
        {InboxTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setSelectedTab(tab.name)}
            className={`flex items-center gap-4 p-4 rounded-[10px] cursor-pointer ${
              selectedTab === tab.name
                ? "bg-[#FFD9C0] hover:bg-[#FFD9C0]"
                : "hover:bg-gray-50"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="w-full col-span-3 border border-[#E8E8E8] rounded-[12px] p-5 flex flex-col gap-6">
        {selectedTab === "Mail" && isStatusPending && (
          <div className="flex items-center gap-2">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm text-foreground">
              Checking connection status...
            </span>
          </div>
        )}
        {selectedTab === "Mail" && data?.connected ? (
          <div className="w-full">
            <div className="flex justify-end gap-3 mb-4 w-full">
              {isPending ? (
                <button className="bg-[#FFD9C0] p-2 rounded-lg cursor-pointer">
                  <Loader size={20} className="animate-spin" />
                </button>
              ) : (
                <button
                  onClick={() => handleSync()}
                  className="bg-[#FFD9C0] p-2 rounded-lg cursor-pointer"
                >
                  <CloudSync size={20} />
                </button>
              )}
            </div>
            <span className="text-sm text-foreground">
              <ShowMail />
            </span>
          </div>
        ) : (
          selectedTab === "Mail" && (
            <AuthorisationPage
              label="Allow access to gmail"
              trigger={
                <CustomButton className="py-3 px-6 rounded-full">
                  Authorize
                </CustomButton>
              }
            >
              <MailAuthorisation />
            </AuthorisationPage>
          )
        )}
      </div>
    </div>
  );
}
