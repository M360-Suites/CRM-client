import { create } from "zustand";
import { User } from "@/types/user";

export interface UserState {
  isLoading: boolean;
  user: User | null;
  setUser: (data: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoading: false,
  user: null,
  setUser: (data) => {
    set({ user: data });
  },
}));
