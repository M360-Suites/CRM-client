"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisconnectGmail } from "@/services/email/disconnect_mail";
import { toast } from "sonner";
import { useGmailStore } from "@/stores/gmail/gmail_store";

export const useMailDisconnect = () => {
  const queryClient = useQueryClient();
  const { setConnectedChannels } = useGmailStore();

  return useMutation({
    mutationFn: DisconnectGmail,
    onSuccess: async (data) => {
      if (data.status) {
        toast.success(data.message);

        // clear local store state for connected channels
        setConnectedChannels([]);

        // invalidate caches related to gmail and then force refetch so UI updates immediately
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["gmailStatus"] }),
          queryClient.invalidateQueries({ queryKey: ["gmailMessage"] }),
          queryClient.invalidateQueries({ queryKey: ["gmailAccount"] }),
        ]);

        await Promise.all([
          queryClient.refetchQueries({
            queryKey: ["gmailStatus"],
            exact: true,
          }),
          queryClient.refetchQueries({
            queryKey: ["gmailMessage"],
            exact: true,
          }),
          queryClient.refetchQueries({
            queryKey: ["gmailAccount"],
            exact: true,
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
};
