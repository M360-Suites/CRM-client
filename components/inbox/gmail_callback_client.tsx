"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGmailStore } from "@/stores/gmail/gmail_store";

export default function GmailCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setConnectedChannels } = useGmailStore();

  useEffect(() => {
    const channel = searchParams.get("channel");
    const connected = searchParams.get("connected");

    if (!channel || connected == null) return;

    setConnectedChannels([
      {
        id: channel,
        label: channel.charAt(0).toUpperCase() + channel.slice(1),
        connected: connected === "true",
      },
    ]);

    // Redirect back to inbox (replace so callback isn't in history)
    router.replace("/inbox");
  }, [searchParams, setConnectedChannels, router]);

  return <div className="p-6 text-sm">Processing connection…</div>;
}
