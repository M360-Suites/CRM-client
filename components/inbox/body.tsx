"use client";

import { MailIcon, InboxIcon, Loader, CloudSync } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { CustomButton } from "../custom/common/customButton";
import ShowMail from "./mail/show_mail";
import MailAuthorisation from "./mail/page";
import { useGmailStore } from "@/stores/gmail/gmail_store";
import { useGmailStatus } from "@/hooks/gmail/gmail_connect_status";
import { useEffect, useState } from "react";
// import MailPage from "./mail/page";
import { useSearchParams } from "next/navigation";
import AuthorisationPage from "./authorisation_layout";
import { useGmailSync } from "@/hooks/gmail/gmail_sync";

const InboxTabs = [
  { name: "All", icon: InboxIcon },
  { name: "Mail", icon: MailIcon },
];

export default function Body() {
  const searchParams = useSearchParams();
  const channel = searchParams?.get("channel");
  const gmailConnected = searchParams?.get("gmail") === "true";
  const [selectedTab, setSelectedTab] = useState("All");
  const { setConnectedChannels, connectedChannels } = useGmailStore();
  const { isPending: isStatusPending, data: statusData } = useGmailStatus();
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

  // Sync API statusData into the local connectedChannels store.
  // If statusData.channel === 'gmail' we'll ensure the store reflects it.
  useEffect(() => {
    if (!statusData?.channel) return;

    const chId = statusData.channel;
    const exists = connectedChannels.find((c) => c.id === chId);

    if (exists) {
      setConnectedChannels(
        connectedChannels.map((c) =>
          c.id === chId
            ? {
                ...c,
                connected: !!statusData.connected,
                label: c.label ?? (chId === "gmail" ? "Google Gmail" : chId),
              }
            : c,
        ),
      );
    } else {
      setConnectedChannels([
        ...connectedChannels,
        {
          id: chId,
          label:
            chId === "gmail"
              ? "Google Gmail"
              : chId.charAt(0).toUpperCase() + chId.slice(1),
          connected: !!statusData.connected,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData]);

  // prefer statusData as authoritative for gmail connection when deciding to show messages
  const gmailIsConnected =
    (statusData?.channel === "gmail" && !!statusData?.connected) ||
    connectedChannels.some((c) => c.id === "gmail" && c.connected);

  return (
    <div className="grid lg:grid-cols-4 gap-5 max-lg:w-full">
      {/* Sidebar tabs */}
      <div className="flex lg:flex-col gap-1 max-lg:w-full px-2.5 lg:py-5 py-2 sticky top-20 col-span-1 max-lg:bg-white lg:self-start border border-[#E8E8E8] lg:rounded-[12px] rounded-full">
        {InboxTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setSelectedTab(tab.name)}
            className={`flex items-center lg:gap-4 gap-2 lg:p-4 max-lg:py-2 max-lg:px-3 lg:rounded-[10px] rounded-full cursor-pointer ${
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
                      <div className="w-10 h-10 rounded bg-[#F6F6F6] flex items-center justify-center text-sm font-medium">
                        <FcGoogle className="w-6 h-6" />
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

            {/* Show messages if gmail is connected (use statusData as authoritative where available) */}
            {gmailIsConnected && (
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
          (statusData?.connected ? (
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
                    <span className="text-sm">Sync mail</span>
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
