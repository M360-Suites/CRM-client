"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleCheck, LoaderCircle } from "lucide-react";

// Debounced save so every keystroke doesn't hit the store (later: the API).
export function useAutosave<T>(value: T, save: (value: T) => void) {
	const [saving, setSaving] = useState(false);
	const saveRef = useRef(save);
	const first = useRef(true);

	useEffect(() => {
		saveRef.current = save;
	});

	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		setSaving(true);
		const timer = setTimeout(() => {
			saveRef.current(value);
			setSaving(false);
		}, 600);
		return () => clearTimeout(timer);
	}, [value]);

	return saving;
}

export function SavedStatus({ saving }: { saving: boolean }) {
	return (
		<span className="flex items-center gap-1.5 text-xs text-[#64748B]">
			{saving ? (
				<LoaderCircle size={14} className="animate-spin" />
			) : (
				<CircleCheck size={14} color="#059669" />
			)}
			{saving ? "Saving" : "Saved"}
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
		<div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
			<div className="flex items-center gap-2 min-w-0">
				<Link
					href={backHref}
					aria-label="Back"
					className="p-1 rounded hover:bg-gray-100"
				>
					<ArrowLeft size={16} color="#0F172A" />
				</Link>
				<input
					aria-label="Title"
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					className="min-w-0 w-64 max-w-full bg-transparent text-base font-medium text-[#0F172A] outline-none rounded px-1 hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#D9E1E8]"
				/>
			</div>
			<div className="flex items-center gap-4 shrink-0">{right}</div>
		</div>
	);
}
