import { create } from "zustand";
import { Company } from "@/types/company";

export interface CompanyState {
  file: File | null;
  headers: string[];
  rows: Record<string, string>[];
  mapping: Record<string, string>;
  setFile: (file: File | null) => void;
  setHeaders: (headers: string[]) => void;
  setRows: (rows: Record<string, string>[]) => void;
  setMapping: (mapping: Record<string, string>) => void;
  resetImport: () => void;
  importSteps: number;
  completedSteps: number[];
  selectedCompany: Company | null;
  companyPreview: Company[];
  setCompletedSteps: (value: number[]) => void;
  setImportSteps: (value: number) => void;
  setSelectedCompany: (company: Company | null) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  file: null,
  headers: [],
  rows: [],
  mapping: {},

  setFile: (file) => set({ file }),
  setHeaders: (headers) => set({ headers }),
  setRows: (rows) => set({ rows }),
  setMapping: (mapping) => set({ mapping }),
  resetImport: () =>
    set({
      file: null,
      headers: [],
      rows: [],
      mapping: {},
      importSteps: 1,
      completedSteps: [],
    }),
  importSteps: 1,
  selectedCompany: null,
  companyPreview: [],
  completedSteps: [],
  setCompletedSteps: (value) => set({ completedSteps: value }),
  setImportSteps: (value) => set({ importSteps: value }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}));
