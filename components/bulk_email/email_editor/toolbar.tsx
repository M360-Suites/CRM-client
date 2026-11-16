"use client";

import { useState } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Baseline,
	Bold,
	Braces,
	Highlighter,
	ImagePlus,
	Italic,
	Link2,
	List,
	ListOrdered,
	LoaderCircle,
	Minus,
	MousePointerClick,
	Quote,
	Redo2,
	RemoveFormatting,
	Strikethrough,
	Underline,
	Undo2,
	Upload,
} from "lucide-react";
import { toast } from "sonner";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { useMergeVariables } from "@/hooks/bulk_email/templates";
import { useImagePicker } from "./use_image_picker";
import { MenuItemsSkeleton } from "../skeletons";

export const TEXT_COLORS = [
	"#0F172A", "#334155", "#64748B", "#94A3B8", "#FFFFFF",
	"#DC2626", "#EA580C", "#D97706", "#16A34A", "#0D9488",
	"#0091FE", "#2563EB", "#7C3AED", "#DB2777", "#3A2418",
];

export const HIGHLIGHT_COLORS = [
	"#FEF08A", "#FDE68A", "#BBF7D0", "#A7F3D0", "#BAE6FD",
	"#C7D2FE", "#E9D5FF", "#FBCFE8", "#FECACA", "#E2E8F0",
];

const FONT_SIZES = ["12px", "14px", "15px", "16px", "18px", "20px", "24px", "28px", "32px", "40px"];

const btn = (active = false) =>
	`h-7 min-w-7 px-1 flex items-center justify-center rounded text-[#334155] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:size-4 ${
		active ? "bg-[#E6F2FF] text-[#0091FE]" : "hover:bg-[#F1F5F9]"
	}`;

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-[#E2E8F0]" />;

function Tool({
	label,
	active,
	disabled,
	onClick,
	children,
}: {
	label: string;
	active?: boolean;
	disabled?: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			aria-pressed={active}
			disabled={disabled}
			onMouseDown={(e) => e.preventDefault()}
			onClick={onClick}
			className={btn(active)}
		>
			{children}
		</button>
	);
}

// Swatches plus a custom picker; used for both text color and highlight
function ColorMenu({
	label,
	icon,
	current,
	colors,
	onPick,
	onClear,
	clearLabel,
}: {
	label: string;
	icon: React.ReactNode;
	current?: string;
	colors: string[];
	onPick: (color: string) => void;
	onClear: () => void;
	clearLabel: string;
}) {
	return (
		<CustomPopover
			align="start"
			className="pt-2 flex flex-col gap-2 w-52"
			trigger={
				<button
					type="button"
					title={label}
					aria-label={label}
					onMouseDown={(e) => e.preventDefault()}
					className={`${btn()} flex-col gap-0`}
				>
					{icon}
					<span
						className="h-1 w-4 rounded-full border border-black/10"
						style={{ background: current ?? "transparent" }}
					/>
				</button>
			}
		>
			<span className="px-1 text-[11px] font-medium text-[#334155]">{label}</span>
			<div className="grid grid-cols-5 gap-1.5 px-1">
				{colors.map((c) => (
					<button
						key={c}
						type="button"
						title={c}
						onClick={() => onPick(c)}
						className={`h-7 w-7 rounded-md border cursor-pointer hover:scale-110 transition-transform ${
							current?.toLowerCase() === c.toLowerCase()
								? "border-[#0091FE] ring-2 ring-[#0091FE]/30"
								: "border-black/10"
						}`}
						style={{ background: c }}
					/>
				))}
			</div>
			<div className="flex items-center gap-2 px-1">
				<label className="relative flex flex-1 items-center gap-2 rounded-md border border-[#E2E8F0] px-2 py-1 text-xs text-[#334155] cursor-pointer hover:bg-gray-50">
					<span
						className="h-4 w-4 rounded-full border border-black/10"
						style={{ background: current ?? "#FFFFFF" }}
					/>
					Custom…
					<input
						type="color"
						aria-label={`Custom ${label.toLowerCase()}`}
						value={current && /^#[0-9a-f]{6}$/i.test(current) ? current : "#000000"}
						onChange={(e) => onPick(e.target.value.toUpperCase())}
						className="absolute inset-0 opacity-0 cursor-pointer"
					/>
				</label>
				<button
					type="button"
					onClick={onClear}
					className="rounded-md border border-[#E2E8F0] px-2 py-1 text-xs text-[#64748B] hover:bg-gray-50 cursor-pointer"
				>
					{clearLabel}
				</button>
			</div>
		</CustomPopover>
	);
}

function LinkMenu({ editor, active }: { editor: Editor; active: boolean }) {
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");

	return (
		<CustomPopover
			align="start"
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
				if (o) setUrl(editor.getAttributes("link").href ?? "");
			}}
			className="pt-2 flex flex-col gap-2 w-64"
			trigger={
				<button
					type="button"
					title="Link"
					aria-label="Link"
					onMouseDown={(e) => e.preventDefault()}
					className={btn(active)}
				>
					<Link2 />
				</button>
			}
		>
			<form
				className="flex flex-col gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					const href = url.trim();
					const chain = editor.chain().focus().extendMarkRange("link");
					if (href) chain.setLink({ href }).run();
					else chain.unsetLink().run();
					setOpen(false);
				}}
			>
				<input
					autoFocus
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://example.com or mailto:…"
					aria-label="Link address"
					className="rounded-[4px] border border-[#E2E8F0] px-2.5 h-8 text-xs outline-none focus:border-[#0091FE]"
				/>
				<div className="flex gap-2">
					<button
						type="submit"
						className="flex-1 rounded-[4px] bg-[#0091FE] h-8 text-xs text-white hover:bg-[#0076D6] cursor-pointer"
					>
						Apply
					</button>
					{active && (
						<button
							type="button"
							onClick={() => {
								editor.chain().focus().extendMarkRange("link").unsetLink().run();
								setOpen(false);
							}}
							className="rounded-[4px] border border-[#E2E8F0] px-3 h-8 text-xs text-[#DC2626] hover:bg-red-50 cursor-pointer"
						>
							Remove
						</button>
					)}
				</div>
			</form>
		</CustomPopover>
	);
}

function ImageMenu({ editor }: { editor: Editor }) {
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");
	const insert = (src: string) => {
		editor.chain().focus().insertContent({ type: "emailImage", attrs: { src } }).run();
		setUrl("");
		setOpen(false);
	};
	const picker = useImagePicker(insert);

	return (
		<>
			{picker.input}
			<CustomPopover
				align="start"
				open={open}
				onOpenChange={setOpen}
				className="pt-2 flex flex-col gap-2 w-64"
				trigger={
					<button
						type="button"
						title="Insert image"
						aria-label="Insert image"
						onMouseDown={(e) => e.preventDefault()}
						className={btn()}
					>
						{picker.uploading ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
					</button>
				}
			>
				<button
					type="button"
					disabled={picker.uploading}
					onClick={picker.pick}
					className="flex items-center justify-center gap-1.5 rounded-[4px] bg-[#0091FE] h-8 text-xs text-white hover:bg-[#0076D6] cursor-pointer disabled:opacity-60"
				>
					<Upload size={14} />
					Upload from device
				</button>
				<span className="text-center text-[10px] text-[#94A3B8]">
					JPG, PNG, GIF or WebP up to 5MB · or paste a link
				</span>
				<form
					className="flex gap-2"
					onSubmit={(e) => {
						e.preventDefault();
						if (!/^https:\/\/\S+$/i.test(url.trim())) {
							toast.error("Use a public image link that starts with https://");
							return;
						}
						insert(url.trim());
					}}
				>
					<input
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://…/photo.jpg"
						aria-label="Image address"
						className="flex-1 min-w-0 rounded-[4px] border border-[#E2E8F0] px-2.5 h-8 text-xs outline-none focus:border-[#0091FE]"
					/>
					<button
						type="submit"
						className="rounded-[4px] border border-[#E2E8F0] px-3 h-8 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer"
					>
						Add
					</button>
				</form>
			</CustomPopover>
		</>
	);
}

function MergeTagMenu({ editor }: { editor: Editor }) {
	const { data: variables, isLoading, isError } = useMergeVariables();
	return (
		<CustomPopover
			align="end"
			title="Merge tags"
			popoverClassname="max-h-80 overflow-y-auto"
			className="pt-2 flex flex-col w-60"
			trigger={
				<button
					type="button"
					title="Insert a merge tag"
					aria-label="Insert a merge tag"
					onMouseDown={(e) => e.preventDefault()}
					className={btn()}
				>
					<Braces />
				</button>
			}
		>
			{isLoading && <MenuItemsSkeleton rows={6} />}
			{isError && (
				<span className="px-2 py-1.5 text-xs text-[#DC2626]">Couldn&apos;t load merge tags</span>
			)}
			{variables?.map((v) => (
				<button
					key={v.tag}
					type="button"
					onClick={() => editor.chain().focus().insertContent(`{{${v.tag}}}`).run()}
					className="flex flex-col items-start px-2 py-1.5 rounded-md text-left hover:bg-gray-100 cursor-pointer"
				>
					<span className="text-xs text-[#0F172A]">{v.label}</span>
					<span className="font-mono text-[10px] text-[#64748B]">{`{{${v.tag}}}`}</span>
				</button>
			))}
		</CustomPopover>
	);
}

export default function Toolbar({ editor }: { editor: Editor }) {
	const s = useEditorState({
		editor,
		selector: ({ editor: e }) => ({
			bold: e.isActive("bold"),
			italic: e.isActive("italic"),
			underline: e.isActive("underline"),
			strike: e.isActive("strike"),
			link: e.isActive("link"),
			bullet: e.isActive("bulletList"),
			ordered: e.isActive("orderedList"),
			quote: e.isActive("blockquote"),
			h1: e.isActive("heading", { level: 1 }),
			h2: e.isActive("heading", { level: 2 }),
			h3: e.isActive("heading", { level: 3 }),
			align: (["left", "center", "right", "justify"] as const).find((a) =>
				e.isActive({ textAlign: a }),
			),
			color: e.getAttributes("textStyle").color as string | undefined,
			fontSize: e.getAttributes("textStyle").fontSize as string | undefined,
			highlight: e.getAttributes("highlight").color as string | undefined,
			canUndo: e.can().undo(),
			canRedo: e.can().redo(),
		}),
	});

	const block = s.h1 ? "h1" : s.h2 ? "h2" : s.h3 ? "h3" : "p";
	const chain = () => editor.chain().focus();

	return (
		<div className="flex flex-wrap items-center gap-0.5">
			<Tool label="Undo" disabled={!s.canUndo} onClick={() => chain().undo().run()}>
				<Undo2 />
			</Tool>
			<Tool label="Redo" disabled={!s.canRedo} onClick={() => chain().redo().run()}>
				<Redo2 />
			</Tool>
			<Divider />
			<select
				aria-label="Text style"
				value={block}
				onChange={(e) => {
					const v = e.target.value;
					if (v === "p") chain().setParagraph().run();
					else chain().setHeading({ level: Number(v[1]) as 1 | 2 | 3 }).run();
				}}
				className="h-7 rounded border border-[#E2E8F0] bg-white px-1.5 text-xs text-[#334155] outline-none cursor-pointer"
			>
				<option value="p">Paragraph</option>
				<option value="h1">Heading 1</option>
				<option value="h2">Heading 2</option>
				<option value="h3">Heading 3</option>
			</select>
			<select
				aria-label="Font size"
				value={s.fontSize ?? ""}
				onChange={(e) =>
					e.target.value
						? chain().setFontSize(e.target.value).run()
						: chain().unsetFontSize().run()
				}
				className="ml-1 h-7 w-[72px] rounded border border-[#E2E8F0] bg-white px-1.5 text-xs text-[#334155] outline-none cursor-pointer"
			>
				<option value="">Size</option>
				{FONT_SIZES.map((size) => (
					<option key={size} value={size}>
						{size.replace("px", "")}
					</option>
				))}
			</select>
			<Divider />
			<Tool label="Bold" active={s.bold} onClick={() => chain().toggleBold().run()}>
				<Bold />
			</Tool>
			<Tool label="Italic" active={s.italic} onClick={() => chain().toggleItalic().run()}>
				<Italic />
			</Tool>
			<Tool label="Underline" active={s.underline} onClick={() => chain().toggleUnderline().run()}>
				<Underline />
			</Tool>
			<Tool label="Strikethrough" active={s.strike} onClick={() => chain().toggleStrike().run()}>
				<Strikethrough />
			</Tool>
			<ColorMenu
				label="Text color"
				icon={<Baseline />}
				current={s.color}
				colors={TEXT_COLORS}
				onPick={(c) => chain().setColor(c).run()}
				onClear={() => chain().unsetColor().run()}
				clearLabel="Default"
			/>
			<ColorMenu
				label="Highlight"
				icon={<Highlighter />}
				current={s.highlight}
				colors={HIGHLIGHT_COLORS}
				onPick={(c) => chain().setHighlight({ color: c }).run()}
				onClear={() => chain().unsetHighlight().run()}
				clearLabel="None"
			/>
			<Divider />
			{(
				[
					["left", AlignLeft],
					["center", AlignCenter],
					["right", AlignRight],
					["justify", AlignJustify],
				] as const
			).map(([a, Icon]) => (
				<Tool
					key={a}
					label={`Align ${a}`}
					active={s.align === a}
					onClick={() => chain().setTextAlign(a).run()}
				>
					<Icon />
				</Tool>
			))}
			<Divider />
			<Tool label="Bulleted list" active={s.bullet} onClick={() => chain().toggleBulletList().run()}>
				<List />
			</Tool>
			<Tool label="Numbered list" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}>
				<ListOrdered />
			</Tool>
			<Tool label="Quote" active={s.quote} onClick={() => chain().toggleBlockquote().run()}>
				<Quote />
			</Tool>
			<Tool label="Divider line" onClick={() => chain().setHorizontalRule().run()}>
				<Minus />
			</Tool>
			<LinkMenu editor={editor} active={s.link} />
			<Divider />
			<ImageMenu editor={editor} />
			<Tool
				label="Insert button"
				onClick={() => chain().insertContent({ type: "emailButton" }).run()}
			>
				<MousePointerClick />
			</Tool>
			<MergeTagMenu editor={editor} />
			<Divider />
			<Tool
				label="Clear formatting"
				onClick={() => chain().unsetAllMarks().clearNodes().run()}
			>
				<RemoveFormatting />
			</Tool>
		</div>
	);
}
