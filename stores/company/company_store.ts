import { create } from "zustand";
import { Company } from "@/types/company";

export interface CompanyState {
  importSteps: number;
  completedSteps: number[];
  selectedCompany: Company | null;
  companies: Company[];
  companyPreview: Company[];
  setCompletedSteps: (value: number[]) => void;
  setImportSteps: (value: number) => void;
  setSelectedCompany: (company: Company | null) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  importSteps: 1,
  companies: [
    {
      _id: "6a11c32f6c58135c46def539",
      name: "Jola Industries",
      industry: "Food & Hospitality",
      website: "https://www.jola.com",
      owner_id: {
        _id: "6a105a031b2fe0919e654b8b",
        email: "ojodanieltoby@gmail.com",
        display_name: "ojo daniel",
      },
      contact_person: "Jola simi",
      email: "jola@gmail.com",
      phone: "09127428680",
      address: "10, adewale street, coker",
      created_at: "2026-05-23T15:09:35.982Z",
      updated_at: "2026-05-23T15:09:35.982Z",
      __v: 0,
    },
  ],
  selectedCompany: null,
  companyPreview: [
    {
      _id: "6a11c32f6c58135c46def539",
      name: "Jola Industries",
      industry: "Food & Hospitality",
      website: "https://www.jola.com",
      owner_id: {
        _id: "6a105a031b2fe0919e654b8b",
        email: "ojodanieltoby@gmail.com",
        display_name: "ojo daniel",
      },
      contact_person: "Jola simi",
      email: "jola@gmail.com",
      phone: "09127428680",
      address: "10, adewale street, coker",
      created_at: "2026-05-23T15:09:35.982Z",
      updated_at: "2026-05-23T15:09:35.982Z",
      __v: 0,
    },
  ],
  completedSteps: [],
  setCompletedSteps: (value) =>
    set((state) => ({
      completedSteps: Array.from(new Set([...state.completedSteps, ...value])),
    })),
  setImportSteps: (value) => set({ importSteps: value }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}));
