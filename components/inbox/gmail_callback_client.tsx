"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGmailStore } from "@/stores/gmail/gmail_store";

export default function GmailCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setConnectedChannels } = useGmailStore();

  useEffect(() => {
    const channel = searchParams.get("channel");
    const gmail = searchParams.get("gmail");
    const connectedAt = searchParams.get("connected_at");

    // If redirected from OAuth with gmail=true and connected_at, force refetch the gmail status
    if (gmail === "true" && connectedAt) {
      // optimistic local store update (keeps UI responsive)
      if (channel) {
        setConnectedChannels([
          { id: channel, label: "Google Gmail", connected: true },
        ]);
      }

      // refetch status & messages/account so app sees the new connection immediately
      (async () => {
        await queryClient.invalidateQueries({ queryKey: ["gmailStatus"] });
        await queryClient.invalidateQueries({ queryKey: ["gmailMessage"] });
        await queryClient.invalidateQueries({ queryKey: ["gmailAccount"] });

        await queryClient.refetchQueries({
          queryKey: ["gmailStatus"],
          exact: true,
        });
        await queryClient.refetchQueries({
          queryKey: ["gmailMessage"],
          exact: true,
        });
        await queryClient.refetchQueries({
          queryKey: ["gmailAccount"],
          exact: true,
        });

        // remove callback params from URL
        router.replace("/inbox");
      })();
    } else if (channel && gmail === "true") {
      // fallback: set store and navigate to Mail tab
      setConnectedChannels([
        { id: channel, label: "Google Gmail", connected: true },
      ]);
      router.replace("/inbox");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return <div className="p-6 text-sm">Processing connection…</div>;
}
