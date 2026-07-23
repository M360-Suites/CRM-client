"use client";

import { useEffect, useState } from "react";
import { CustomButton } from "@/components/custom/common/customButton";
import { X } from "lucide-react"; // or use any close icon you have

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setShowInstall(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowInstall(false);
  };

  if (!showInstall || dismissed) return null;

  return (
    <div className="fixed bottom-10 left-0 font-inter right-0 z-100 px-5">
      <div className="flex flex-col p-4 rounded-2xl bg-[#F5B7A3]/80 border border-border items-center justify-between gap-4 w-sm max-md:w-full mx-auto">
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
