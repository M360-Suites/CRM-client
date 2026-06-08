import React, { Suspense } from "react";
import GmailCallbackPage from "@/components/inbox/gmail_callback_client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GmailCallbackPage />
    </Suspense>
  );
}
