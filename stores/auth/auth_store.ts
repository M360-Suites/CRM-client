import { create } from "zustand";

export interface AuthState {
  registerStep: number;
  setRegisterStep: (value: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  registerStep: 1,
  setRegisterStep: (value) => set({ registerStep: value }),
}));
