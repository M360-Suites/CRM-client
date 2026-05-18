import { create } from "zustand";

export interface ContactState {
  importSteps: number;
  completedSteps: number[];
  selectedContact: {
    id: number;
    name: string;
    email: string;
    company: string;
    date: string;
    status: string;
    role?: string;
    phone?: string;
  } | null;
  contacts: {
    id: number;
    name: string;
    email: string;
    company: string;
    date: string;
    status: string;
    role?: string;
  }[];
  contactPreview: {
    id: number;
    firstname: string;
    phone: string;
    lastname: string;
    email: string;
    company: string;
    date: string;
    status: string;
    role?: string;
  }[];
  setCompletedSteps: (value: number[]) => void;
  setImportSteps: (value: number) => void;
  setSelectedContact: (contact: ContactState["selectedContact"]) => void;
}

export const useContactStore = create<ContactState>((set) => ({
  importSteps: 1,
  contacts: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      company: "Acme Corp",
      date: "2024-06-01",
      status: "Hot",
      role: "Manager",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      company: "Beta Inc",
      date: "2024-06-02",
      status: "Warm",
      role: "Developer",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      company: "Gamma LLC",
      date: "2024-06-03",
      status: "Cold",
      role: "Designer",
    },
  ],
  selectedContact: null,
  contactPreview: [
    {
      id: 1,
      lastname: "Doe",
      firstname: "John",
      email: "john.doe@example.com",
      company: "Acme Corp",
      date: "2024-06-01",
      status: "Hot",
      role: "Manager",
      phone: "07049370621",
    },
    {
      id: 2,
      lastname: "Smith",
      firstname: "Jola",
      email: "jolasmith@gmail.com",
      company: "Acme Corp",
      date: "2024-06-01",
      status: "Warm",
      role: "Developer",
      phone: "09089783265",
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
