"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/forms/reset_password_form";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-8 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[100%] tracking-tight font-medium">
          Reset Password
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          Enter a new password to continue
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
