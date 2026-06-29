"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AcceptInviteForm from "@/components/auth/forms/accept_invite_form";

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("invitationToken");
  const displayName = searchParams.get("display_name");

  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-8 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] max-md:text-2xl/[120%] max-xs:text-lg tracking-tight font-medium">
          Set Password
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          Enter a password to continue
        </p>
      </div>
      <AcceptInviteForm
        invitationToken={invitationToken}
        displayName={displayName}
      />
    </div>
  );
}

export default function AcceptInviteClient() {
  return (
    <Suspense fallback={null}>
      <SetPasswordContent />
    </Suspense>
  );
}
