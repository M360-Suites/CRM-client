import { create } from "zustand";

export interface AuthState {
  registerStep: number;
  onboardingStep: number;
  setOnboardingStep: (value: number) => void;
  setRegisterStep: (value: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  registerStep: 1,
  onboardingStep: 1,
  setOnboardingStep: (value) => set({ onboardingStep: value}),
  setRegisterStep: (value) => set({ registerStep: value }),
}));
