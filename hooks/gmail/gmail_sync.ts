"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GmailSync } from "@/services/email/gmail_sync";
import { SyncResponse } from "@/types/gmail";

export const useGmailSync = () => {
  const queryClient = useQueryClient();

  return useMutation<SyncResponse>({
    mutationFn: GmailSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmailStatus"] });
      queryClient.invalidateQueries({ queryKey: ["gmailMessages"] });
    },
  });
};
