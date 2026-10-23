"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import CommentInput from "@/components/custom/common/comment_input";
import { getInitials } from "@/lib/utils";
import { PipelineTeamMembers } from "@/types/pipeline";

const MAX_SUGGESTIONS = 6;

// Text between the last "@" and the caret, if the user is typing a mention
const getActiveQuery = (text: string, caret: number) => {
	const match = /(^|\s)@([^\s@]*)$/.exec(text.slice(0, caret));
	return match ? { query: match[2], start: caret - match[2].length - 1 } : null;
};

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Longest names first so "@Ada Obi" wins over "@Ada"
const mentionPattern = (members: PipelineTeamMembers[]) => {
	const names = members
		.map((member) => member.display_name)
		.filter(Boolean)
		.sort((a, b) => b.length - a.length)
		.map(escapeRegExp);
	return names.length ? new RegExp(`@(${names.join("|")})`, "g") : null;
};

export const getMentionedIds = (
	content: string,
	members: PipelineTeamMembers[],
) => {
	const pattern = mentionPattern(members);
	if (!pattern) return [];
	const names = new Set(
		Array.from(content.matchAll(pattern), (match) => match[1]),
	);
	return members
		.filter((member) => names.has(member.display_name))
		.map((member) => member.id);
};

export function MentionText({
	content,
	members,
	mentionClassName,
}: {
	content: string;
	members: PipelineTeamMembers[];
	mentionClassName: string;
}) {
	const pattern = useMemo(() => mentionPattern(members), [members]);
	if (!pattern) return <>{content}</>;

	return (
		<>
			{content.split(pattern).map((part, index) =>
				// split() with a capture group puts the matched names at odd indexes
				index % 2 === 1 ? (
					<span key={index} className={mentionClassName}>
						@{part}
					</span>
				) : (
					<Fragment key={index}>{part}</Fragment>
				),
			)}
		</>
	);
}

export function MentionInput({
	value,
	onChange,
	members,
}: {
	value: string;
	onChange: (value: string) => void;
	members: PipelineTeamMembers[];
}) {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [active, setActive] = useState<{
		query: string;
		start: number;
	} | null>(null);
	const [highlighted, setHighlighted] = useState(0);

	const suggestions = useMemo(() => {
		if (!active) return [];
		const q = active.query.toLowerCase();
		return members
			.filter(
				(member) =>
					member.display_name.toLowerCase().includes(q) ||
					member.email.toLowerCase().includes(q),
			)
			.sort((a, b) => a.display_name.localeCompare(b.display_name))
			.slice(0, MAX_SUGGESTIONS);
	}, [active, members]);

	const open = !!active && suggestions.length > 0;

	const syncActive = (text: string, caret: number) => {
		setActive(getActiveQuery(text, caret));
		setHighlighted(0);
	};

	const insertMention = (member: PipelineTeamMembers) => {
		if (!active) return;
		const caret = active.start + 1 + active.query.length;
		const mention = `@${member.display_name} `;
		const next = value.slice(0, active.start) + mention + value.slice(caret);
		const nextCaret = active.start + mention.length;
		onChange(next);
		setActive(null);
		requestAnimationFrame(() => {
			inputRef.current?.focus();
			inputRef.current?.setSelectionRange(nextCaret, nextCaret);
		});
	};

	return (
		<div className="relative w-full">
			{open && (
				<div className="absolute bottom-full left-0 mb-1 w-64 max-w-full rounded-md border border-[#E2E8F0] bg-white p-1 shadow-md z-10">
					{suggestions.map((member, index) => (
						<button
							key={member.id}
							type="button"
							// Keep focus in the textarea while picking
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => insertMention(member)}
							onMouseEnter={() => setHighlighted(index)}
							className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left cursor-pointer ${
								index === highlighted ? "bg-gray-100" : ""
							}`}
						>
							<span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00B3A6] text-[10px] font-semibold text-white">
								{getInitials(member.display_name)}
							</span>
							<div className="flex min-w-0 flex-col">
								<span className="text-xs text-foreground truncate">
									{member.display_name}
								</span>
								<span className="text-[10px] text-foreground/50 truncate">
									{member.email}
								</span>
							</div>
						</button>
					))}
				</div>
			)}
			<CommentInput
				ref={inputRef}
				type="text"
				textArea={true}
				value={value}
				// Lets the comment dialog ignore Escape while the list is open
				data-mention-open={open}
				placeholder="Write a comment… type @ to mention someone"
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
					const target = e.target;
					onChange(target.value);
					syncActive(target.value, target.selectionStart ?? 0);
				}}
				onSelect={(e: React.SyntheticEvent<HTMLTextAreaElement>) => {
					const target = e.currentTarget;
					if (target.selectionStart !== target.selectionEnd) return;
					syncActive(target.value, target.selectionStart ?? 0);
				}}
				onBlur={() => setActive(null)}
				onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
					if (!open) return;
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setHighlighted((i) => (i + 1) % suggestions.length);
					} else if (e.key === "ArrowUp") {
						e.preventDefault();
						setHighlighted(
							(i) => (i - 1 + suggestions.length) % suggestions.length,
						);
					} else if (e.key === "Enter" || e.key === "Tab") {
						e.preventDefault();
						insertMention(suggestions[highlighted]);
					} else if (e.key === "Escape") {
						setActive(null);
					}
				}}
			/>
		</div>
	);
}
