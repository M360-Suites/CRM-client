import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Channel {
  id: string;
  label?: string;
  connected: boolean;
  [key: string]: any;
}

interface MailStore {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  connectedChannels: Channel[];
  setConnectedChannels: (channels: Channel[]) => void;
  addOrUpdateChannel: (channel: Channel) => void;
  removeChannel: (id: string) => void;
  toggleChannel: (id: string, connected?: boolean) => void;
  clearChannels: () => void;
}

export const useGmailStore = create<MailStore>()(
  persist(
    (set) => ({
      connectedChannels: [],
      page: 1,
      limit: 25,
      setPage: (page) => set({ page }),
      setLimit: (limit) => set({ limit }),

      setConnectedChannels: (channels) => set({ connectedChannels: channels }),

      addOrUpdateChannel: (channel) =>
        set((state) => {
          const idx = state.connectedChannels.findIndex(
            (c) => c.id === channel.id,
          );
          if (idx > -1) {
            const next = [...state.connectedChannels];
            next[idx] = { ...next[idx], ...channel };
            return { connectedChannels: next };
          }
          return { connectedChannels: [...state.connectedChannels, channel] };
        }),

      removeChannel: (id) =>
        set((state) => ({
          connectedChannels: state.connectedChannels.filter((c) => c.id !== id),
        })),

      toggleChannel: (id, connected) =>
        set((state) => ({
          connectedChannels: state.connectedChannels.map((c) =>
            c.id === id ? { ...c, connected: connected ?? !c.connected } : c,
          ),
        })),

      clearChannels: () => set({ connectedChannels: [] }),
    }),
    {
      name: "gmail_store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage,
      ),
    },
  ),
);
