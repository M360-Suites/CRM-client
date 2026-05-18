import { create } from "zustand";

export interface DashState {
  activeLink: string;
  setActiveLink: (value: string) => void;
}

export const useDashStore = create<DashState>((set) => ({
  activeLink: "",
  setActiveLink: (value) => set({ activeLink: value }),
}));
