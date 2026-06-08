"use client";
// import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGmailStore } from "@/stores/gmail/gmail_store";
import { useGmailCallback } from "@/hooks/gmail/gmail_callback";

export default function GmailCallbackPage() {
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const { mutate: handleCallback, isPending } = useGmailCallback();

  // useEffect(() => {
  //   const code = searchParams.get("code");
  //   const state = searchParams.get("state");
  //   const channel = searchParams.get("channel");

  //   if (code && state) {
  //     handleCallback(
  //       { code, state },
  //       {
  //         onSuccess: (data) => console.log("Gmail callback successful:", data),
  //         onError: () => router.replace("/inbox?connected=false"),
  //       },
  //     );
  //   }
  // }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4">
      {/* <span className="text-sm text-muted-foreground">
        {isPending ? (
          <Loader size={40} className="animate-spin" />
        ) : (
          "Redirecting..."
        )}
      </span> */}
      redirecting
    </div>
  );
}
