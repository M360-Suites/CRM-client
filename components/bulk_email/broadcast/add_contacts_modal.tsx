"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGetAllContacts } from "@/hooks/contact/get_all_contacts";
import { useDebounced } from "@/hooks/bulk_email/use_debounced";
import { BroadcastAudience, ContactTemperature } from "@/types/bulk_email";
import { Contact } from "@/types/contact";
import { TEMPERATURE_STYLES, isAllContacts } from "../data";
import { Bone } from "../skeletons";

const PAGE = 50;

const FILTERS: { label: string; value: ContactTemperature | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Hot", value: "hot" },
	{ label: "Warm", value: "warm" },
	{ label: "Cold", value: "cold" },
];

const fullName = (c: Contact) =>
	[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email || "Unnamed";

// The backend skips contacts without an email, so they can't be picked
const canEmail = (c: Contact) => !!c.email?.trim();

const temperatureOf = (c: Contact) =>
	(c.temperature?.toLowerCase() ?? "") as ContactTemperature | "";

interface Props {
	audience: BroadcastAudience;
	onDone: (audience: BroadcastAudience) => void;
	onClose: () => void;
}

function AddContactsWindow({ audience, onDone, onClose }: Props) {
	const { data: contacts, isLoading, isError } = useGetAllContacts();
	// "All contacts" is its own state so it keeps covering contacts added later
	const [all, setAll] = useState(isAllContacts(audience));
	const [ids, setIds] = useState(() => new Set(audience.contact_ids ?? []));
	// Older broadcasts were saved with a temperature group ("Hot contacts")
	// instead of a list. Start those ticked with the matching contacts.
	const legacyTemps = !audience.contact_ids?.length ? (audience.temperature ?? []) : [];
	const [seeded, setSeeded] = useState(legacyTemps.length === 0);
	const [filter, setFilter] = useState<ContactTemperature | "all">("all");
	const [search, setSearch] = useState("");
	const [shown, setShown] = useState(PAGE);
	const term = useDebounced(search.trim().toLowerCase(), 200);

	const emailable = useMemo(() => (contacts ?? []).filter(canEmail), [contacts]);
	const emailableIds = useMemo(() => new Set(emailable.map((c) => c._id)), [emailable]);

	if (!seeded && contacts) {
		const temps = new Set<string>(legacyTemps);
		setSeeded(true);
		setIds(new Set(emailable.filter((c) => temps.has(temperatureOf(c))).map((c) => c._id)));
	}

	// Saved picks can point at contacts that were deleted or lost their email;
	// those can't be sent to, so they don't count and are dropped on Done
	const validIds = useMemo(
		() => (contacts ? Array.from(ids).filter((id) => emailableIds.has(id)) : Array.from(ids)),
		[contacts, ids, emailableIds],
	);

	const matches = useMemo(
		() =>
			(contacts ?? []).filter((c) => {
				if (filter !== "all" && temperatureOf(c) !== filter) return false;
				if (!term) return true;
				return [fullName(c), c.email, c.company_id?.name, c.role_title]
					.filter(Boolean)
					.some((v) => v!.toLowerCase().includes(term));
			}),
		[contacts, filter, term],
	);

	const narrowed = filter !== "all" || !!term;
	const isChecked = (c: Contact) => canEmail(c) && (all || ids.has(c._id));
	const shownEmailable = matches.filter(canEmail);
	const selectAllChecked = narrowed
		? shownEmailable.length > 0 && shownEmailable.every(isChecked)
		: all;
	const selectedCount = all ? emailable.length : validIds.length;
	const canFinish = all || selectedCount > 0;

	// Ticking everyone one by one is the same as "all contacts"
	const commit = (next: Set<string>) => {
		if (emailable.length > 0 && emailable.every((c) => next.has(c._id))) {
			setAll(true);
			setIds(new Set());
		} else {
			setIds(next);
		}
	};

	// Leaving "all" mode turns it into an explicit list of everyone
	const expandAll = () => {
		const everyone = new Set(emailable.map((c) => c._id));
		setAll(false);
		return everyone;
	};

	const toggle = (c: Contact) => {
		if (!canEmail(c)) return;
		const next = all ? expandAll() : new Set(ids);
		if (next.has(c._id)) next.delete(c._id);
		else next.add(c._id);
		commit(next);
	};

	const toggleSelectAll = () => {
		if (!narrowed) {
			// No filter or search: this is the "send to all contacts" switch
			if (all) {
				setAll(false);
				setIds(new Set());
			} else {
				setAll(true);
			}
			return;
		}
		// Filter/search active: tick or untick everyone currently shown
		const next = all ? expandAll() : new Set(ids);
		shownEmailable.forEach((c) => (selectAllChecked ? next.delete(c._id) : next.add(c._id)));
		commit(next);
	};

	const done = () => {
		if (!canFinish) return;
		onDone(all ? { all: true } : { contact_ids: validIds });
	};

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-[1360px] w-[calc(100vw-2rem)] h-[88vh] p-0 gap-0 flex flex-col overflow-hidden rounded-xl"
			>
				<div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] px-6 py-4 md:px-12">
					<div className="flex flex-col">
						<DialogTitle className="text-2xl font-medium text-[#0F172A]">
							Add Contacts
						</DialogTitle>
						<DialogDescription className="text-xs text-[#64748B]">
							{all
								? "Sending to all contacts"
								: `${selectedCount} ${selectedCount === 1 ? "contact" : "contacts"} selected`}
						</DialogDescription>
					</div>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={onClose}
							className="h-12 rounded-full border border-[#E2E8F0] bg-white px-12 text-sm text-[#0F172A] hover:bg-gray-50 cursor-pointer max-md:px-6"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={done}
							disabled={!canFinish}
							title={canFinish ? undefined : "Pick at least one contact"}
							className="h-12 rounded-full bg-[#0091FE] px-24 text-sm text-white hover:bg-[#0076D6] cursor-pointer max-md:px-8 disabled:cursor-not-allowed disabled:bg-[#9CCFFF]"
						>
							Done
						</button>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-8 pb-6 md:px-12">
					<label className="flex h-12 items-center gap-4 rounded-md border border-[#E2E8F0] bg-white px-4 pr-10 text-xs text-[#0F172A] cursor-pointer">
						<input
							type="checkbox"
							checked={selectAllChecked}
							onChange={toggleSelectAll}
							disabled={!contacts?.length}
							className="h-4 w-4 accent-[#0091FE] cursor-pointer"
						/>
						{narrowed ? "Select all shown" : "Select All"}
					</label>

					<div className="flex h-12 min-w-64 flex-1 max-w-[630px] items-center gap-3 rounded-full border border-[#D9E1E8] bg-[#F2F7FB] px-5">
						<Search size={20} color="#0F172A" />
						<input
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setShown(PAGE);
							}}
							placeholder="Search by name,email,company..."
							className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#64748B]"
						/>
					</div>

					<div className="flex items-center gap-2">
						{FILTERS.map((f) => (
							<button
								key={f.value}
								type="button"
								onClick={() => {
									setFilter(f.value);
									setShown(PAGE);
								}}
								className={`h-11 rounded-full px-3.5 text-sm cursor-pointer ${
									filter === f.value
										? "bg-[#0091FE] text-white"
										: "border border-[#D9E1E8] bg-[#F2F7FB] text-[#334155] hover:bg-gray-200"
								}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-6 pb-6 md:px-12">
					{isLoading ? (
						<div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
							{Array.from({ length: 8 }, (_, i) => (
								<div
									key={i}
									className="grid grid-cols-[40px_1.2fr_1fr_1.4fr_96px] items-center gap-4 border-b border-[#E2E8F0] bg-[#F7FAFC] px-6 py-5 last:border-b-0 max-md:grid-cols-[32px_1fr_80px]"
								>
									<Bone className="h-4 w-4 rounded-sm" />
									<Bone className="h-3.5 w-3/4 justify-self-center" />
									<Bone className="h-3.5 w-1/2 justify-self-center max-md:hidden" />
									<Bone className="h-3.5 w-2/3 justify-self-center max-md:hidden" />
									<Bone className="h-7 w-16 rounded-full justify-self-center" />
								</div>
							))}
						</div>
					) : isError ? (
						<p className="py-20 text-center text-sm text-[#DC2626]">
							Couldn&apos;t load your contacts. Try again shortly.
						</p>
					) : matches.length === 0 ? (
						<p className="py-20 text-center text-sm text-foreground">
							{contacts?.length ? "No contacts match your search" : "You don't have any contacts yet"}
						</p>
					) : (
						<div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
							{matches.slice(0, shown).map((c) => {
								const temp = temperatureOf(c);
								const disabled = !canEmail(c);
								return (
									<label
										key={c._id}
										className={`grid grid-cols-[40px_1.2fr_1fr_1.4fr_96px] items-center gap-4 border-b border-[#E2E8F0] bg-[#F7FAFC] px-6 py-4 text-center text-sm text-[#334155] last:border-b-0 max-md:grid-cols-[32px_1fr_80px] ${
											disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-[#EEF5FB]"
										}`}
									>
										<input
											type="checkbox"
											checked={isChecked(c)}
											disabled={disabled}
											onChange={() => toggle(c)}
											className="h-4 w-4 accent-[#0091FE] cursor-pointer disabled:cursor-not-allowed"
										/>
										<span className="flex flex-col">
											<span className="text-[#334155]">{fullName(c)}</span>
											{c.role_title && (
												<span className="font-medium text-[#0F172A]">{c.role_title}</span>
											)}
										</span>
										<span className="truncate max-md:hidden">{c.company_id?.name || "—"}</span>
										<span className="truncate max-md:hidden">
											{disabled ? <span className="italic text-[#94A3B8]">No email</span> : c.email}
										</span>
										<span className="flex justify-center">
											{temp && TEMPERATURE_STYLES[temp] && (
												<span className={`rounded-full px-3 py-1.5 text-sm capitalize ${TEMPERATURE_STYLES[temp]}`}>
													{temp}
												</span>
											)}
										</span>
									</label>
								);
							})}
						</div>
					)}
					{matches.length > shown && (
						<div className="flex justify-center pt-4">
							<button
								type="button"
								onClick={() => setShown((n) => n + PAGE)}
								className="rounded-full border border-[#D9E1E8] bg-white px-5 py-2 text-xs text-[#334155] hover:bg-gray-50 cursor-pointer"
							>
								Show more ({matches.length - shown} left)
							</button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

// Mounted only while open, so Cancel always throws away unsaved picks
export default function AddContactsModal({ open, ...props }: Props & { open: boolean }) {
	if (!open) return null;
	return <AddContactsWindow {...props} />;
}
