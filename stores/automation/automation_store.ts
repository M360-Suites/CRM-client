import { create } from "zustand";
import { Automation } from "@/types/automation";
import { MOCK_AUTOMATIONS } from "@/components/automations/data";

// Client-only state for the automation screens.
// TODO: swap for react-query hooks once the automation endpoints exist.
export interface AutomationState {
	automations: Automation[];
	saveAutomation: (automation: Automation) => void;
	deleteAutomation: (id: string) => void;
}

export const useAutomationStore = create<AutomationState>((set) => ({
	automations: MOCK_AUTOMATIONS,
	saveAutomation: (automation) =>
		set((state) => ({
			automations: state.automations.some((a) => a._id === automation._id)
				? state.automations.map((a) =>
						a._id === automation._id ? automation : a,
					)
				: [automation, ...state.automations],
		})),
	deleteAutomation: (id) =>
		set((state) => ({
			automations: state.automations.filter((a) => a._id !== id),
		})),
}));
