import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

export interface UserState {
  isLoading: boolean;
  user: User | null;
  setUser: (data: User) => void;
  showInstall: boolean;
  setShowInstall: (show: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoading: false,
      user: null,
      setUser: (data) => {
        set({ user: data });
      },
      showInstall: true,
      setShowInstall: (show) => {
        set({ showInstall: show });
      },
    }),
    {
      name: "show-install-prompt",
      partialize: (state) => ({ showInstallPrompt: state.showInstall }),
    },
  ),
);
