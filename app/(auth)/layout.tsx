"use client";

import Image from "next/image";
import HalfSide from "@/components/auth/halfside";
import CRMLOGO from "@/public/assets/company/logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/auth_store";
import { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setOnboardingStep, onboardingStep } = useAuthStore();
  const isOnboardingPage = pathname === "/onboarding";

  useEffect(() => {
    // Check if user is already authenticated via server-side endpoint
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth-status");
        const data = await response.json();

        if (data.isAuthenticated) {
          // User is authenticated and verified, redirect to dashboard
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuth();
  }, [router]);

  const handleSkipClick = () => {
    if (onboardingStep === 1) {
      setOnboardingStep(2);
    } else {
      return;
    }
  };

  return (
    <div className="min-h-screen h-full overflow-hidden p-4 flex gap-5 font-inter">
      <HalfSide />
      <div className="lg:w-1/2 md:w-full sm:w-full w-full flex flex-col items-start gap-16 ">
        <div
          className={`flex flex-row items-center w-full py-5 ${isOnboardingPage ? "justify-between" : "justify-end"}`}
        >
          <div className="hidden">
            {isOnboardingPage && (
              <button
                className="text-base text-start cursor-pointer hover:underline px-5 text-[#E2725B] tracking-[-0.002em] font-normal"
                onClick={handleSkipClick}
              >
                Skip
              </button>
            )}
          </div>
          <Image
            src={CRMLOGO}
            alt="crm_logo"
            width={800}
            loading="eager"
            height={800}
            className="h-12 w-auto"
          />
        </div>
        <div className="flex-1 w-full sm:px-5 md:px-20 lg:px-8 xl:px-20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
