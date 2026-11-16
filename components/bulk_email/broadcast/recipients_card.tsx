"use client";

import { useMemo } from "react";
import { UserPlus, Users, X } from "lucide-react";
import { useAudiencePreview } from "@/hooks/bulk_email/broadcasts";
import { useGetAllContacts } from "@/hooks/contact/get_all_contacts";
import { BroadcastAudience } from "@/types/bulk_email";
import { isAllContacts } from "../data";
import AddContactsModal from "./add_contacts_modal";
import { Bone } from "../skeletons";

const MAX_CHIPS = 8;

// Who the broadcast goes to (AUDIENCE section of the send panel): all contacts
// or a picked list, set in the Add Contacts modal, with a live count from the
// backend. The modal is controlled so the preview header's "Change" opens it too.
export default function RecipientsCard({
	audience,
	onChange,
	open,
	setOpen,
}: {
	audience: BroadcastAudience;
	onChange: (audience: BroadcastAudience) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const { data: contacts } = useGetAllContacts();
	const reach = useAudiencePreview(audience);
	const all = isAllContacts(audience);
	const picked = useMemo(() => audience.contact_ids ?? [], [audience.contact_ids]);

	const names = useMemo(() => {
		const byId = new Map((contacts ?? []).map((c) => [c._id, c]));
		return picked.flatMap((id) => {
			const c = byId.get(id);
			// Once contacts load, hide picks that were deleted since; the backend skips them
			if (contacts && !c) return [];
			const name = c ? [c.first_name, c.last_name].filter(Boolean).join(" ") || c.email : null;
			return [{ id, name: name || "Loading…" }];
		});
	}, [contacts, picked]);

	const remove = (id: string) =>
		onChange({ contact_ids: picked.filter((x) => x !== id) });

	return (
		<div className="flex flex-col gap-3 border-b border-[#F1F5F9] px-4 py-5">
			<div className="flex items-center justify-between gap-3">
				<span className="text-xs font-semibold tracking-wider text-[#334155]">AUDIENCE</span>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="flex items-center gap-1.5 rounded-full bg-[#E6F2FF] px-3 py-1 text-xs text-[#0091FE] hover:bg-[#D5E9FF] cursor-pointer"
				>
					<UserPlus size={14} />
					{all || picked.length ? "Edit" : "Add contacts"}
				</button>
			</div>

			{all ? (
				<span className="flex items-center gap-2 text-sm text-[#0F172A]">
					<Users size={16} color="#0091FE" />
					All contacts
				</span>
			) : picked.length === 0 ? (
				<span className="text-sm text-[#B45309]">No contacts yet. Add who should get this email.</span>
			) : (
				<div className="flex flex-wrap gap-1.5">
					{names.slice(0, MAX_CHIPS).map((c) => (
						<span
							key={c.id}
							className="flex items-center gap-1 rounded-full bg-[#F1F5F9] py-1 pl-2.5 pr-1 text-xs text-[#334155]"
						>
							{c.name}
							<button
								type="button"
								aria-label={`Remove ${c.name}`}
								onClick={() => remove(c.id)}
								className="rounded-full p-0.5 text-[#94A3B8] hover:bg-white hover:text-[#DC2626] cursor-pointer"
							>
								<X size={12} />
							</button>
						</span>
					))}
					{names.length > MAX_CHIPS && (
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs text-[#0091FE] hover:bg-[#E2E8F0] cursor-pointer"
						>
							+{names.length - MAX_CHIPS} more
						</button>
					)}
				</div>
			)}

			{(all || picked.length > 0) && (
				<span className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#64748B]">
					{reach.isLoading ? (
						<Bone className="h-3 w-36" />
					) : reach.isError ? (
						"Couldn't count recipients"
					) : (
						<>
							{reach.data?.count ?? 0} will receive this
							{!!reach.data?.opted_out &&
								` · ${reach.data.opted_out} left out (unsubscribed or bounced)`}
						</>
					)}
				</span>
			)}
			<p className="text-[11px] text-[#64748B] leading-[18px]">
				Contacts without an email address or who unsubscribed are left out
				automatically.
			</p>

			<AddContactsModal
				open={open}
				audience={audience}
				onClose={() => setOpen(false)}
				onDone={(next) => {
					onChange(next);
					setOpen(false);
				}}
			/>
		</div>
	);
}
