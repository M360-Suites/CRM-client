"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OtpVerificationForm from "@/components/auth/forms/otp_verification_form";

function OtpVerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-20 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] tracking-tight font-medium">
          Email verification
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          A 5 digit code has been sent to{" "}
          <span className="font-medium text-[#E2725B]">
            {email || "your email"}
          </span>
        </p>
      </div>
      <OtpVerificationForm email={email} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OtpVerificationContent />
    </Suspense>
  );
}
