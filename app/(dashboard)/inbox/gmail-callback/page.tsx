"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useGmailCallback } from "@/hooks/gmail/gmail_callback";

export default function GmailCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate: handleCallback, isPending } = useGmailCallback();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      handleCallback(
        { code, state },
        {
          onSuccess: () => router.replace("/inbox?connected=true"),
          onError: () => router.replace("/inbox?connected=false"),
        },
      );
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-sm text-muted-foreground">
        {isPending ? (
          <Loader size={40} className="animate-spin" />
        ) : (
          "Redirecting..."
        )}
      </span>
    </div>
  );
}
