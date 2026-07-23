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
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-primary p-3 shadow-lg">
      <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            Install CRM360 for a better experience
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <CustomButton
            className="font-inter text-sm px-4 py-2"
            onClick={handleInstall}
          >
            Install
          </CustomButton>
          <button
            onClick={handleDismiss}
            className="p-1 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
