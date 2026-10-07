"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import EmailVerificationForm from "@/components/auth/forms/email_verification_form";

function VerificationPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-20 max-lg:gap-15 bg-white">
      <div className="flex flex-col gap-2 items-center w-full px-4 text-center">
        <h2 className="text-foreground text-[32px]/[120%] max-md:text-2xl/[120%] max-xs:text-lg tracking-tight font-medium">
          Email verification
        </h2>
        <p className="text-foreground text-base/[120%] max-sm:text-sm/[120%] tracking-[-0.002em] font-normal max-w-full">
          A 5 digit code has been sent to{" "}
          <span className="font-medium text-[#00B3A6] wrap-anywhere">
            {email || "your email"}
          </span>
        </p>
      </div>
      <EmailVerificationForm email={email} />
    </div>
  );
}

export default function VerificationClient() {
  return (
    <Suspense fallback={null}>
      <VerificationPageContent />
    </Suspense>
  );
}
