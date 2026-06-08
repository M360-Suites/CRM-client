"use client";

import { MailIcon, InboxIcon, Loader, CloudSync } from "lucide-react";
import { CustomButton } from "../custom/common/customButton";
import ShowMail from "./mail/show_mail";
import MailAuthorisation from "./mail/page";
import { useGmailStore } from "@/stores/gmail/gmail_store";
import { useGmailStatus } from "@/hooks/gmail/gmail_connect_status";
import { useEffect, useState } from "react";
import MailPage from "./mail/page";
import { useSearchParams } from "next/navigation";
import AuthorisationPage from "./authorisation_layout";
import { useGmailSync } from "@/hooks/gmail/gmail_sync";

const InboxTabs = [
  { name: "All", icon: InboxIcon },
  { name: "Mail", icon: MailIcon },
];

export default function Body() {
  const searchParams = useSearchParams();
  const channel = searchParams?.get("channel"); // e.g. "gmail"
  const gmailConnected = searchParams?.get("gmail") === "true";

  const [selectedTab, setSelectedTab] = useState("All");

  const { setConnectedChannels, connectedChannels } = useGmailStore();
  const { isPending: isStatusPending, data } = useGmailStatus();
  const { mutate: handleSync, isPending } = useGmailSync();

  // When redirected back from OAuth, store the connected channel
  // and switch to the Mail tab automatically
  useEffect(() => {
    if (channel && gmailConnected) {
      setConnectedChannels([
        {
          id: channel,
          label: channel.charAt(0).toUpperCase() + channel.slice(1),
          connected: true,
        },
      ]);
      setSelectedTab("Mail");
    }
  }, [channel, gmailConnected, setConnectedChannels]);

  return (
    <div className="grid grid-cols-4 gap-5">
      {/* Sidebar tabs */}
      <div className="flex flex-col gap-1 px-2.5 py-5 sticky top-20 col-span-1 self-start border border-[#E8E8E8] rounded-[12px]">
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

      {/* Content */}
      <div className="w-full col-span-3 border border-[#E8E8E8] rounded-[12px] p-5 flex flex-col gap-6">
        {/* All tab */}
        {selectedTab === "All" && (
          <div className="w-full">
            <h3 className="text-sm font-medium">All Channels</h3>

            {connectedChannels.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3">
                {connectedChannels.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#F6F6F6] flex items-center justify-center text-sm font-medium">
                        {(c.label ?? c.id).charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-medium capitalize">
                        {c.label ?? c.id}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        c.connected ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {c.connected ? "Connected" : "Disconnected"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 py-8 px-4 text-sm text-muted-foreground border rounded-md">
                No channels connected. Authorize a channel to start syncing
                messages.
              </div>
            )}

            {/* Show messages if gmail is connected */}
            {connectedChannels.some((c) => c.id === "gmail" && c.connected) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Messages</h3>
                <ShowMail />
              </div>
            )}
          </div>
        )}

        {/* Mail tab — loading */}
        {selectedTab === "Mail" && isStatusPending && (
          <div className="flex items-center gap-2">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm text-foreground">
              Checking connection status...
            </span>
          </div>
        )}

        {/* Mail tab — loaded */}
        {selectedTab === "Mail" &&
          !isStatusPending &&
          (data?.connected ? (
            <div className="w-full">
              <div className="flex justify-end gap-3 mb-4 w-full">
                {isPending ? (
                  <CustomButton className="bg-[#FFD9C0] px-3.5 rounded-full cursor-pointer">
                    <Loader size={20} className="animate-spin" />
                    <span className="text-sm">Syncing</span>
                  </CustomButton>
                ) : (
                  <CustomButton
                    onClick={() => handleSync()}
                    className="rounded-full px-3.5"
                  >
                    <CloudSync size={20} />
                    <span className="text-sm">Sync Mail</span>
                  </CustomButton>
                )}
              </div>
              <ShowMail />
            </div>
          ) : (
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
          ))}
      </div>
    </div>
  );
}
