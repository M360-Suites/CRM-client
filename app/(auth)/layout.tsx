"use client";

import Image from "next/image";
import HalfSide from "@/components/auth/halfside";
import CRMLOGO from "@/public/assets/company/logo.png";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth/auth_store";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { setOnboardingStep, onboardingStep } = useAuthStore();
  const isOnboardingPage = pathname === "/onboarding";

  const handleSkipClick = () => {
    if (onboardingStep === 1) {
      setOnboardingStep(2);
    } else {
      return;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden mx-auto container xl:p-5 px-5 flex gap-5 font-inter">
      <HalfSide />
      <div className="lg:w-1/2 md:w-full sm:w-full w-full h-full flex flex-col items-start gap-16 pb-10 overflow-y-auto">
        <div
          className={`flex flex-row items-center w-full py-10 ${isOnboardingPage ? "justify-between" : "justify-end"}`}
        >
          <div>
            {isOnboardingPage && (
              <button
                className="text-base text-start cursor-pointer hover:underline px-5 text-[#E2725B] tracking-[-0.002em] font-normal"
                onClick={handleSkipClick}
              >
                Skip
              </button>
            )}
          </div>
          <div className="self-end">
            <Image
              src={CRMLOGO}
              alt="crm_logo"
              width={800}
              loading="eager"
              height={800}
              className="h-12 w-auto"
            />
          </div>
        </div>
        <div className="flex-1 w-full sm:px-5 md:px-10 lg:px-8 xl:px-20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
