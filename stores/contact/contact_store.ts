import { create } from "zustand";
import { Contact } from "@/types/contact";

export interface ContactState {
  importSteps: number;
  completedSteps: number[];
  selectedContact: Contact | null;
  contacts: Contact[];
  contactPreview: Contact[];
  setCompletedSteps: (value: number[]) => void;
  setImportSteps: (value: number) => void;
  setSelectedContact: (contact: Contact | null) => void;
}

export const useContactStore = create<ContactState>((set) => ({
  importSteps: 1,
  contacts: [
    {
      _id: "6a11e367cb1fb8657013ca6a",
      first_name: "boluwatife",
      last_name: "ojo",
      email: "watifeb278@gmail.com",
      phone: "09127422780",
      role_title: "Lead CX",
      company_id: {
        _id: "6a11c1e46c58135c46def538",
        name: "M360solutions",
        industry: "Finance",
        website: "https://www.m360sooluitons.com",
      },
      owner_id: {
        _id: "6a105a031b2fe0919e654b8b",
        email: "ojodanieltoby@gmail.com",
        display_name: "ojo daniel",
      },
      temperature: "warm",
      tags: [],
      created_at: "2026-05-23T17:27:03.559Z",
      updated_at: "2026-05-23T17:27:03.559Z",
      __v: 0,
    },
  ],
  selectedContact: null,
  contactPreview: [
    {
      _id: "6a11e367cb1fb8657013ca6a",
      first_name: "boluwatife",
      last_name: "ojo",
      email: "watifeb278@gmail.com",
      phone: "09127422780",
      role_title: "Lead CX",
      company_id: {
        _id: "6a11c1e46c58135c46def538",
        name: "M360solutions",
        industry: "Finance",
        website: "https://www.m360sooluitons.com",
      },
      owner_id: {
        _id: "6a105a031b2fe0919e654b8b",
        email: "ojodanieltoby@gmail.com",
        display_name: "ojo daniel",
      },
      temperature: "warm",
      tags: [],
      created_at: "2026-05-23T17:27:03.559Z",
      updated_at: "2026-05-23T17:27:03.559Z",
      __v: 0,
    },
  ],
  completedSteps: [],
  setCompletedSteps: (value) =>
    set((state) => ({
      completedSteps: Array.from(new Set([...state.completedSteps, ...value])),
    })),
  setImportSteps: (value) => set({ importSteps: value }),
  setSelectedContact: (contact) => set({ selectedContact: contact }),
}));
