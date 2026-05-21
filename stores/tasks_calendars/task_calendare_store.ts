import { create } from "zustand";

interface TasksAndCalendarStore {
  activeTab: "list" | "calendar";
  setActiveTab: (tab: "list" | "calendar") => void;
}

export const useTasksAndCalendarStore = create<TasksAndCalendarStore>(
  (set) => ({
    activeTab: "list",
    setActiveTab: (tab) => set({ activeTab: tab }),
  }),
);
