import { create } from "zustand";

interface PipelineStore {
  isDropped: boolean;
  isTarget: string | null;
  setIsTarget: (value: string | null) => void;
  setIsDropped: (value: boolean) => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  isDropped: false,
  isTarget: null,
  setIsTarget: (value: string | null) => set({ isTarget: value }),
  setIsDropped: (value: boolean) => set({ isDropped: value }),
}));
