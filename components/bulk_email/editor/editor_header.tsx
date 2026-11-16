"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Cloud, CloudOff, LoaderCircle } from "lucide-react";

// Debounced save so every keystroke doesn't hit the API. Saves run one at a
// time, and flush() pushes any pending change right away (e.g. before send).
export function useAutosave<T>(
	value: T,
	save: (value: T) => Promise<unknown>,
	delay = 800,
) {
	const [saving, setSaving] = useState(false);
	const [failed, setFailed] = useState(false);
	const saveRef = useRef(save);
	const latest = useRef(value);
	const saved = useRef(value);
	const dirty = useRef(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const chain = useRef<Promise<void>>(Promise.resolve());

	useEffect(() => {
		saveRef.current = save;
	});

	const flush = useCallback(() => {
		clearTimeout(timer.current);
		chain.current = chain.current.then(async () => {
			if (!dirty.current) return;
			dirty.current = false;
			const snapshot = latest.current;
			try {
				await saveRef.current(snapshot);
				saved.current = snapshot;
				setFailed(false);
			} catch (err) {
				dirty.current = true;
				setFailed(true);
				throw err;
			} finally {
				if (!dirty.current) setSaving(false);
			}
		});
		const result = chain.current;
		// Keep the queue alive after a failure; the caller still sees the error
		chain.current = chain.current.catch(() => {});
		return result;
	}, []);

	useEffect(() => {
		latest.current = value;
		if (Object.is(value, saved.current)) return;
		dirty.current = true;
		setSaving(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			flush().catch(() => {});
		}, delay);
	}, [value, delay, flush]);

	// Don't drop the last edits when leaving the page
	useEffect(
		() => () => {
			if (dirty.current) flush().catch(() => {});
		},
		[flush],
	);

	return { saving, failed, flush };
}

export function SavedStatus({
	saving,
	failed = false,
}: {
	saving: boolean;
	failed?: boolean;
}) {
	return (
		<span
			className={`flex items-center gap-1.5 text-xs ${failed ? "text-[#DC2626]" : "text-[#94A3B8]"}`}
		>
			{saving && !failed ? (
				<LoaderCircle size={14} className="animate-spin" />
			) : failed ? (
				<CloudOff size={14} />
			) : (
				<Cloud size={14} />
			)}
			{failed ? "Not saved" : saving ? "Saving" : "Saved"}
		</span>
	);
}

export default function EditorHeader({
	backHref,
	title,
	onTitleChange,
	right,
}: {
	backHref: string;
	title: string;
	onTitleChange: (title: string) => void;
	right: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex items-center gap-4 min-w-0">
				<Link
					href={backHref}
					aria-label="Back"
					className="p-1 rounded hover:bg-gray-100"
				>
					<ChevronLeft size={16} color="#94A3B8" />
				</Link>
				<input
					aria-label="Title"
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					className="min-w-0 w-64 max-w-full bg-transparent text-base text-[#0F172A] outline-none rounded px-1 hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#D9E1E8]"
				/>
			</div>
			<div className="flex items-center gap-4 shrink-0">{right}</div>
		</div>
	);
}
