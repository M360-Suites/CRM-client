import { create } from "zustand";
import { PipelineBoard, Deal } from "@/types/pipeline";

interface PipelineStore {
  leads: PipelineBoard[];
  setLeads: (leads: PipelineBoard[] | PipelineBoard | undefined) => void;
  moveLeadToStage: (dealId: string, stageId: string) => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  leads: [],
  setLeads: (leads) =>
    set({
      leads: Array.isArray(leads) ? leads : leads ? [leads] : [],
    }),
  moveLeadToStage: (dealId, stageId) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.stages.find((stage) => stage.id === dealId)
          ? { ...lead, stage: stageId }
          : lead,
      ),
    })),
}));
