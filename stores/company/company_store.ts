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
      id: "1",
      contactPerson: "John Doe",
      companyName: "Acme Corp",
      companyAddress: "123 Main St, Anytown, USA",
      industry: "Technology",
      email: "john.doe@acmecorp.com",
      phone: "07049370621",
      website: "www.acmecorp.com",
      notes: "Leading provider of tech solutions.",
      contact: 10,
      deals: 5,
      pipelineRevenue: 100000,
      wonRevenue: 50000,
    },
    {
      id: "2",
      contactPerson: "Jane Smith",
      email: "jane.smith@betainc.com",
      companyAddress: "456 Elm St, Othertown, USA",
      phone: "07049370622",
      companyName: "Beta Inc",
      industry: "Finance",
      website: "www.betainc.com",
      notes: "Specializes in financial services.",
      contact: 5,
      deals: 2,
      pipelineRevenue: 50000,
      wonRevenue: 25000,
    },
    {
      id: "3",
      contactPerson: "Alice Johnson",
      email: "alice.johnson@gamma.com",
      companyAddress: "789 Oak St, Sometown, USA",
      phone: "07049370623",
      companyName: "Gamma LLC",
      industry: "Retail",
      website: "www.gamma.com",
      notes: "Leading retailer in consumer goods.",
      contact: 8,
      deals: 3,
      pipelineRevenue: 75000,
      wonRevenue: 40000,
    },
  ],
  selectedCompany: null,
  companyPreview: [
    {
      id: "1",
      contactPerson: "John Doe",
      email: "john.doe@acmecorp.com",
      companyAddress: "123 Main St, Anytown, USA",
      phone: "07049370621",
      companyName: "Acme Corp",
      industry: "Technology",
      website: "www.acmecorp.com",
      notes: "Leading provider of tech solutions.",
      contact: 10,
      deals: 5,
      pipelineRevenue: 100000,
      wonRevenue: 50000,
    },
    {
      id: "2",
      contactPerson: "Jane Smith",
      email: "jane.smith@betainc.com",
      companyAddress: "456 Elm St, Othertown, USA",
      phone: "07049370622",
      companyName: "Beta Inc",
      industry: "Finance",
      website: "www.betainc.com",
      notes: "Specializes in financial services.",
      contact: 5,
      deals: 2,
      pipelineRevenue: 50000,
      wonRevenue: 25000,
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
