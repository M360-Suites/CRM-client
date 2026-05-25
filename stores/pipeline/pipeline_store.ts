import { create } from "zustand";
import { Lead } from "@/components/pipeline/draggable";

interface PipelineStore {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  moveLeadToStage: (leadId: string, newStage: string) => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  leads: [],
  setLeads: (leads) => set({ leads }),
  moveLeadToStage: (leadId, newStage) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead._id === leadId ? { ...lead, stage: newStage } : lead,
      ),
    })),
}));
