"use client";

import { useEffect, useState } from "react";
import { CustomButton } from "@/components/custom/common/customButton";
import { useUserStore } from "@/stores/user/user_store";
import { X } from "lucide-react";

const INSTALL_DISMISSED_KEY = "crm360_install_dismissed";

export default function InstallPrompt() {
  const { showInstall, setShowInstall } = useUserStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // if user already dismissed it before, never show again
    if (localStorage.getItem(INSTALL_DISMISSED_KEY) === "true") {
      setShowInstall(false);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [setShowInstall]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
      localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
  };

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
