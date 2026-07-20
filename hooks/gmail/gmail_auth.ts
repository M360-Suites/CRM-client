"use client";
import { useMutation } from "@tanstack/react-query";
import { AuthorizeGmail } from "@/services/email/gmail_auth";
import { toast } from "sonner";

export const useGmailAuth = () => {
  return useMutation({
    mutationFn: AuthorizeGmail,
    onSuccess: (data) => {
      if (data.status) {
        window.location.href = data?.data?.url || "";
      } else {
        toast.error(data.message);
      }
    },
  });
};
