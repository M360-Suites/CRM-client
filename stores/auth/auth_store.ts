import { create } from "zustand";

export interface AuthState {
  resetOtpToken: string;
  isLoading: boolean;
  registerStep: number;
  onboardingStep: number;
  isLoginLoading: boolean;
  setOnboardingStep: (value: number) => void;
  setRegisterStep: (value: number) => void;
  setResetOtpToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  resetOtpToken: "",
  isLoading: false,
  isLoginLoading: false,
  registerStep: 1,
  onboardingStep: 1,
  setOnboardingStep: (value) => set({ onboardingStep: value }),
  setRegisterStep: (value) => set({ registerStep: value }),
  setResetOtpToken: (token) => set({ resetOtpToken: token }),
}));
