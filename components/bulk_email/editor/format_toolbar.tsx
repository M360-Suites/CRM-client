"use client";

import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Code,
	Droplet,
	Link2,
	PenLine,
	Pilcrow,
	Redo2,
	Undo2,
} from "lucide-react";
import { CustomPopover } from "@/components/custom/common/customPopover";

// Rich text toolbar for the email body. Commands act on the current selection
// inside the canvas' contentEditable, which fires `input` so changes are saved.

const MERGE_TAGS = [
	{ label: "First name", tag: "{{ first_name }}" },
	{ label: "Last name", tag: "{{ last_name }}" },
	{ label: "Company", tag: "{{ company }}" },
	{ label: "Email", tag: "{{ email }}" },
];

const BLOCKS = [
	{ label: "Paragraph", tag: "p" },
	{ label: "Heading 1", tag: "h1" },
	{ label: "Heading 2", tag: "h2" },
	{ label: "Heading 3", tag: "h3" },
];

const SIZES = [
	{ label: "Small", size: "2" },
	{ label: "Normal", size: "3" },
	{ label: "Large", size: "5" },
];

// Menus and color pickers take focus, so remember the last selection made in
// the editor and put it back before running a command.
let savedRange: Range | null = null;

const editorOf = (range: Range) => {
	const node = range.commonAncestorContainer;
	const el = node instanceof Element ? node : node.parentElement;
	return el?.closest<HTMLElement>("[data-email-editor]") ?? null;
};

if (typeof document !== "undefined") {
	document.addEventListener("selectionchange", () => {
		const sel = document.getSelection();
		if (!sel?.rangeCount) return;
		const range = sel.getRangeAt(0);
		if (editorOf(range)) savedRange = range.cloneRange();
	});
}

const restoreSelection = () => {
	const editor = savedRange && editorOf(savedRange);
	if (savedRange && editor?.isConnected) {
		editor.focus();
		const sel = document.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(savedRange);
	}
};

const exec = (command: string, value?: string) => {
	restoreSelection();
	document.execCommand(command, false, value);
};

const wrapInCode = () => {
	restoreSelection();
	const text = document.getSelection()?.toString();
	if (!text) return;
	const escaped = text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
	document.execCommand("insertHTML", false, `<code>${escaped}</code>`);
};

// Keep focus (and so the selection) in the editor when a toolbar button is pressed
const keepSelection = (e: React.MouseEvent) => e.preventDefault();

function ToolButton({
	label,
	onClick,
	children,
}: {
	label: string;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			onMouseDown={keepSelection}
			onClick={onClick}
			className="h-6 min-w-6 px-1 flex items-center justify-center rounded text-sm text-[#334155] hover:bg-[#F1F5F9] cursor-pointer [&_svg]:size-3.5"
		>
			{children}
		</button>
	);
}

function MenuButton({
	label,
	trigger,
	items,
}: {
	label: string;
	trigger: React.ReactNode;
	items: { label: React.ReactNode; onSelect: () => void }[];
}) {
	return (
		<CustomPopover
			align="start"
			className="pt-2 flex flex-col min-w-32"
			trigger={
				<button
					type="button"
					title={label}
					aria-label={label}
					onMouseDown={keepSelection}
					className="h-6 min-w-6 px-1 flex items-center justify-center rounded text-sm text-[#334155] hover:bg-[#F1F5F9] cursor-pointer [&_svg]:size-3.5"
				>
					{trigger}
				</button>
			}
		>
			{items.map((item, i) => (
				<button
					key={i}
					type="button"
					onMouseDown={keepSelection}
					onClick={item.onSelect}
					className="text-left px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-gray-100 cursor-pointer"
				>
					{item.label}
				</button>
			))}
		</CustomPopover>
	);
}

const Divider = () => <span className="mx-1 h-3.5 w-px bg-[#E2E8F0]" />;

export default function FormatToolbar({
	className = "",
	right,
}: {
	className?: string;
	right?: React.ReactNode;
}) {
	return (
		<div className={`flex items-center justify-between gap-2 ${className}`}>
			<div className="flex items-center flex-wrap gap-0.5">
				<MenuButton
					label="Paragraph style"
					trigger={<Pilcrow />}
					items={BLOCKS.map((b) => ({
						label: b.label,
						onSelect: () => exec("formatBlock", b.tag),
					}))}
				/>
				<Divider />
				<ToolButton label="Undo" onClick={() => exec("undo")}>
					<Undo2 />
				</ToolButton>
				<ToolButton label="Redo" onClick={() => exec("redo")}>
					<Redo2 />
				</ToolButton>
				<Divider />
				<ToolButton label="Bold" onClick={() => exec("bold")}>
					<b>B</b>
				</ToolButton>
				<ToolButton label="Italic" onClick={() => exec("italic")}>
					<i className="font-serif">I</i>
				</ToolButton>
				<ToolButton label="Underline" onClick={() => exec("underline")}>
					<u>U</u>
				</ToolButton>
				<ToolButton
					label="Strikethrough"
					onClick={() => exec("strikeThrough")}
				>
					<s>S</s>
				</ToolButton>
				<Divider />
				<ToolButton label="Align left" onClick={() => exec("justifyLeft")}>
					<AlignLeft />
				</ToolButton>
				<ToolButton
					label="Align center"
					onClick={() => exec("justifyCenter")}
				>
					<AlignCenter />
				</ToolButton>
				<ToolButton label="Align right" onClick={() => exec("justifyRight")}>
					<AlignRight />
				</ToolButton>
				<ToolButton label="Justify" onClick={() => exec("justifyFull")}>
					<AlignJustify />
				</ToolButton>
				<Divider />
				<MenuButton
					label="Text size"
					trigger={<span className="text-xs font-semibold">Tt</span>}
					items={SIZES.map((s) => ({
						label: s.label,
						onSelect: () => exec("fontSize", s.size),
					}))}
				/>
				<label
					title="Text color"
					onMouseDown={keepSelection}
					className="relative h-6 min-w-6 flex items-center justify-center rounded text-[#334155] hover:bg-[#F1F5F9] cursor-pointer"
				>
					<Droplet size={14} />
					<input
						type="color"
						aria-label="Text color"
						onChange={(e) => exec("foreColor", e.target.value)}
						className="absolute inset-0 opacity-0 cursor-pointer"
					/>
				</label>
				<label
					title="Highlight"
					onMouseDown={keepSelection}
					className="relative h-6 min-w-6 flex items-center justify-center rounded text-[#334155] hover:bg-[#F1F5F9] cursor-pointer"
				>
					<PenLine size={14} />
					<input
						type="color"
						aria-label="Highlight color"
						defaultValue="#FEF08A"
						onChange={(e) => exec("hiliteColor", e.target.value)}
						className="absolute inset-0 opacity-0 cursor-pointer"
					/>
				</label>
				<ToolButton
					label="Link"
					onClick={() => {
						const url = window.prompt("Link URL", "https://");
						if (url) exec("createLink", url);
					}}
				>
					<Link2 />
				</ToolButton>
				<ToolButton label="Inline code" onClick={wrapInCode}>
					<Code />
				</ToolButton>
				<MenuButton
					label="Insert merge tag"
					trigger={<span className="text-sm">@</span>}
					items={MERGE_TAGS.map((m) => ({
						label: m.label,
						onSelect: () => exec("insertText", m.tag),
					}))}
				/>
			</div>
			{right}
		</div>
	);
}
