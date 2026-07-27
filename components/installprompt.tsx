"use client";

import { useEffect, useState } from "react";
import { CustomButton } from "@/components/custom/common/customButton";
import { useUserStore } from "@/stores/user/user_store";
import { X } from "lucide-react";

export default function InstallPrompt() {
  // Read state and setter directly from your persisted Zustand store
  const { showInstall, setShowInstall } = useUserStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // CRITICAL FIX: Only show the banner if the user hasn't permanently closed it
      if (showInstall) {
        setShowInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [showInstall, setShowInstall]); // Added dependencies to keep the listener context updated

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    // Save 'false' to localStorage if they successfully install
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    // Save 'false' to localStorage so it never triggers again on this browser
    setShowInstall(false);
  };

  // Fixed duplicate !showInstall check
  if (!showInstall || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-10 left-0 font-inter right-0 z-100 px-5">
      <div className="flex flex-col p-4 rounded-2xl bg-[#FFF3E6] border border-border items-center justify-between gap-4 w-sm max-md:w-full mx-auto">
        <button
          onClick={handleDismiss}
          className="p-1 text-black/80 hover:text-black self-end transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground font-inter truncate">
            Install CRM360 for a better experience
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <CustomButton
            className="font-inter text-sm px-8 w-full py-3"
            onClick={handleInstall}
          >
            Install
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
