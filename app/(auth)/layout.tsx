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
    <div className="min-h-screen overflow-hidden mx-auto container">
      <div className="flex flex-row gap-4 justify-between font-inter bg-white w-full h-full py-5 px-6">
        <div className="h-full w-1/2">
          <HalfSide />
        </div>
        <div className="w-1/2 overflow-y-auto flex flex-col items-center gap-16">
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
                height={800}
                className="h-12 w-auto"
              />
            </div>
          </div>
          <div className="flex-1 w-full px-10 xl:px-20">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
