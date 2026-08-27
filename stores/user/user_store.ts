import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AnalyticsSummaryProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

export interface UserState {
  isLoading: boolean;
  user: User | null;
  setUser: (data: User) => void;
  showInstall: boolean;
  setShowInstall: (show: boolean) => void;

  // time frame
  pipelineStateTimeframe: AnalyticsSummaryProps["timeframe"];
  setPipelineStateTimeframe: (
    timeframe: AnalyticsSummaryProps["timeframe"],
  ) => void;

  leadSourceTimeframe: AnalyticsSummaryProps["timeframe"];
  setLeadSourceTimeframe: (
    timeframe: AnalyticsSummaryProps["timeframe"],
  ) => void;
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
      pipelineStateTimeframe: "monthly",
      setPipelineStateTimeframe: (timeframe) => {
        set({ pipelineStateTimeframe: timeframe });
      },
      leadSourceTimeframe: "monthly",
      setLeadSourceTimeframe: (timeframe) => {
        set({ leadSourceTimeframe: timeframe });
      },
    }),
    {
      name: "show-install-prompt",
      partialize: (state) => ({ showInstallPrompt: state.showInstall }),
    },
  ),
);
