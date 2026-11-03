import { create } from "zustand";
import { BulkEmail, EmailTemplate } from "@/types/bulk_email";
import { MOCK_EMAILS, MOCK_TEMPLATES } from "@/components/bulk_email/data";

// Client-only state for the bulk email screens.
// TODO: swap for react-query hooks once the bulk email endpoints exist.
export interface BulkEmailState {
	emails: BulkEmail[];
	templates: EmailTemplate[];
	saveEmail: (email: BulkEmail) => void;
	deleteEmail: (id: string) => void;
	saveTemplate: (template: EmailTemplate) => void;
	deleteTemplate: (id: string) => void;
}

const upsert = <T extends { _id: string }>(list: T[], item: T) =>
	list.some((x) => x._id === item._id)
		? list.map((x) => (x._id === item._id ? item : x))
		: [item, ...list];

export const useBulkEmailStore = create<BulkEmailState>((set) => ({
	emails: MOCK_EMAILS,
	templates: MOCK_TEMPLATES,
	saveEmail: (email) =>
		set((state) => ({ emails: upsert(state.emails, email) })),
	deleteEmail: (id) =>
		set((state) => ({ emails: state.emails.filter((e) => e._id !== id) })),
	saveTemplate: (template) =>
		set((state) => ({ templates: upsert(state.templates, template) })),
	deleteTemplate: (id) =>
		set((state) => ({
			templates: state.templates.filter((t) => t._id !== id),
		})),
}));
