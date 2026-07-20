"use client";
import { useMutation } from "@tanstack/react-query";
import { AuthorizeWhatsapp } from "@/services/email/whatsapp_auth";
import { toast } from "sonner";

export const useWhatsappAuth = () => {
  return useMutation({
    mutationFn: AuthorizeWhatsapp,
    onSuccess: (data) => {
      if (data.status) {
        window.location.href = data.data?.url || "";
      } else {
        toast.error(data.message);
      }
    },
  });
};
