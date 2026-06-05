"use client";
import { useMutation } from "@tanstack/react-query";
import { AuthorizeGmail } from "@/services/email/gmail_auth";
import { GmailAuthResponse } from "@/types/gmail";

export const useGmailAuth = () => {
  return useMutation<GmailAuthResponse>({
    mutationFn: AuthorizeGmail,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
};
