"use client";

import { useState } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { NodeSelection, Selection } from "@tiptap/pm/state";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Crop,
	LoaderCircle,
	Trash2,
	Upload,
} from "lucide-react";
import { EmailDesign, SectionName, SectionStyle } from "@/types/bulk_email";
import { Accordion, ColorField, Segmented, Slider, TextField, Toggle } from "./controls";
import { FONT_OPTIONS, SECTION_LABELS, SECTION_NODES } from "./design";
import type { EmailButtonAttrs, EmailImageAttrs, ImageAlign } from "./extensions";
import { useImagePicker } from "./use_image_picker";
import CropDialog from "./crop_dialog";

const SECTION_BY_NODE = Object.fromEntries(
	Object.entries(SECTION_NODES).map(([k, v]) => [v, k]),
) as Record<string, SectionName>;

const ALIGN_OPTIONS = [
	{ value: "left" as ImageAlign, label: <AlignLeft size={14} />, title: "Left" },
	{ value: "center" as ImageAlign, label: <AlignCenter size={14} />, title: "Center" },
	{ value: "right" as ImageAlign, label: <AlignRight size={14} />, title: "Right" },
];

const Heading = ({ children }: { children: React.ReactNode }) => (
	<h3 className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">{children}</h3>
);

// Positions of the three sections, so the panel can jump to and restyle them
export const sectionPositions = (editor: Editor) => {
	const found: Partial<Record<SectionName, { pos: number; attrs: SectionStyle }>> = {};
	editor.state.doc.forEach((node, offset) => {
		const name = SECTION_BY_NODE[node.type.name];
		if (name) found[name] = { pos: offset, attrs: node.attrs as SectionStyle };
	});
	return found;
};

const focusSection = (editor: Editor, name: SectionName) => {
	const pos = sectionPositions(editor)[name]?.pos;
	if (pos == null) return;
	// Nearest valid spot inside the section: a text cursor, or the image/button
	// itself when the section has no text (e.g. a header with just a logo)
	editor
		.chain()
		.focus()
		.command(({ tr }) => {
			tr.setSelection(Selection.near(tr.doc.resolve(pos + 1)));
			return true;
		})
		.scrollIntoView()
		.run();
};

function ImageSettings({ editor, attrs, maxWidth }: { editor: Editor; attrs: EmailImageAttrs; maxWidth: number }) {
	const set = (patch: Partial<EmailImageAttrs>) =>
		editor.chain().updateAttributes("emailImage", patch).run();
	const picker = useImagePicker((src) => set({ src }));
	const [cropping, setCropping] = useState(false);
	const full = attrs.width == null;

	return (
		<div className="flex flex-col gap-4">
			<Heading>Image</Heading>
			{picker.input}
			{attrs.src && (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={attrs.src} alt="" className="max-h-28 w-full rounded-md object-cover ring-1 ring-black/5" />
			)}
			<div className="flex gap-2">
				<button
					type="button"
					onClick={picker.pick}
					disabled={picker.uploading}
					className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white py-1.5 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer disabled:opacity-60"
				>
					{picker.uploading ? <LoaderCircle size={14} className="animate-spin" /> : <Upload size={14} />}
					{picker.uploading ? "Uploading…" : "Replace"}
				</button>
				<button
					type="button"
					onClick={() => setCropping(true)}
					disabled={!attrs.src}
					className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white py-1.5 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer disabled:opacity-60"
				>
					<Crop size={14} />
					Crop
				</button>
				<button
					type="button"
					title="Remove image"
					aria-label="Remove image"
					onClick={() => editor.chain().focus().deleteSelection().run()}
					className="flex items-center justify-center rounded-md border border-[#FECACA] bg-white px-2.5 py-1.5 text-xs text-[#DC2626] hover:bg-red-50 cursor-pointer"
				>
					<Trash2 size={14} />
				</button>
			</div>
			{attrs.src && (
				<CropDialog
					src={attrs.src}
					open={cropping}
					onClose={() => setCropping(false)}
					onCropped={(src) => set({ src })}
				/>
			)}
			<TextField label="Image address" value={attrs.src} placeholder="https://" onChange={(src) => set({ src })} />
			<Toggle
				label="Full width"
				checked={full}
				onChange={(on) => set({ width: on ? null : Math.round(maxWidth * 0.6) })}
			/>
			{!full && (
				<Slider
					label="Width"
					value={attrs.width ?? maxWidth}
					min={40}
					max={maxWidth}
					unit="px"
					onChange={(width) => set({ width })}
				/>
			)}
			<Segmented label="Alignment" value={attrs.align} options={ALIGN_OPTIONS} onChange={(align) => set({ align })} />
			<Slider label="Corner radius" value={attrs.radius} min={0} max={48} unit="px" onChange={(radius) => set({ radius })} />
			<Slider label="Border" value={attrs.border_width} min={0} max={12} unit="px" onChange={(border_width) => set({ border_width })} />
			{attrs.border_width > 0 && (
				<ColorField label="Border color" value={attrs.border_color} onChange={(border_color) => set({ border_color })} />
			)}
			<TextField
				label="Link when clicked"
				value={attrs.href ?? ""}
				placeholder="https://"
				onChange={(href) => set({ href: href.trim() ? href : null })}
			/>
			<TextField
				label="Alt text (shown if images are blocked)"
				value={attrs.alt}
				placeholder="Describe the image"
				onChange={(alt) => set({ alt })}
			/>
			<p className="text-[11px] leading-4 text-[#64748B]">
				Tip: drag a corner to resize, or drag the grip on the left to move the
				image into another section.
			</p>
		</div>
	);
}

function ButtonSettings({ editor, attrs }: { editor: Editor; attrs: EmailButtonAttrs }) {
	const set = (patch: Partial<EmailButtonAttrs>) =>
		editor.chain().updateAttributes("emailButton", patch).run();
	return (
		<div className="flex flex-col gap-4">
			<Heading>Button</Heading>
			<TextField label="Text" value={attrs.label} onChange={(label) => set({ label })} />
			<TextField label="Link" value={attrs.href} placeholder="https://" onChange={(href) => set({ href })} />
			<div className="grid grid-cols-2 gap-3">
				<ColorField label="Button" value={attrs.background} onChange={(background) => set({ background })} />
				<ColorField label="Text" value={attrs.color} onChange={(color) => set({ color })} />
			</div>
			<Slider label="Corner radius" value={attrs.radius} min={0} max={30} unit="px" onChange={(radius) => set({ radius })} />
			<Segmented label="Alignment" value={attrs.align} options={ALIGN_OPTIONS} onChange={(align) => set({ align })} />
			<Toggle label="Full width" checked={attrs.full_width} onChange={(full_width) => set({ full_width })} />
			<button
				type="button"
				onClick={() => editor.chain().focus().deleteSelection().run()}
				className="flex items-center justify-center gap-1.5 rounded-md border border-[#FECACA] bg-white py-1.5 text-xs text-[#DC2626] hover:bg-red-50 cursor-pointer"
			>
				<Trash2 size={14} />
				Remove button
			</button>
		</div>
	);
}

function SectionSettings({
	editor,
	name,
	pos,
	attrs,
}: {
	editor: Editor;
	name: SectionName;
	pos: number;
	attrs: SectionStyle;
}) {
	const set = (patch: Partial<SectionStyle>) =>
		editor
			.chain()
			.command(({ tr }) => {
				tr.setNodeMarkup(pos, undefined, { ...attrs, ...patch });
				return true;
			})
			.run();

	return (
		<div className="flex flex-col gap-4">
			<Heading>{SECTION_LABELS[name]} section</Heading>
			<div className="grid grid-cols-2 gap-3">
				<ColorField label="Background" allowTransparent value={attrs.background_color} onChange={(background_color) => set({ background_color })} />
				<ColorField label="Text" value={attrs.text_color} onChange={(text_color) => set({ text_color })} />
			</div>
			<Slider label="Space top & bottom" value={attrs.padding_y} min={0} max={96} unit="px" onChange={(padding_y) => set({ padding_y })} />
			<Slider label="Space left & right" value={attrs.padding_x} min={0} max={80} unit="px" onChange={(padding_x) => set({ padding_x })} />
			<p className="text-[11px] leading-4 text-[#64748B]">
				Select text to change its color or highlight it from the toolbar.
				Empty sections are left out of the sent email.
			</p>
		</div>
	);
}

function EmailSettings({
	design,
	onChange,
}: {
	design: EmailDesign;
	onChange: (patch: Partial<EmailDesign>) => void;
}) {
	return (
		<Accordion title="Email style" defaultOpen={false}>
			<div className="grid grid-cols-2 gap-3">
				<ColorField label="Page" value={design.background_color} onChange={(background_color) => onChange({ background_color })} />
				<ColorField label="Email" value={design.content_background} onChange={(content_background) => onChange({ content_background })} />
			</div>
			<ColorField label="Links" value={design.link_color} onChange={(link_color) => onChange({ link_color })} />
			<Slider label="Email width" value={design.content_width} min={480} max={720} unit="px" onChange={(content_width) => onChange({ content_width })} />
			<Slider label="Corner radius" value={design.content_radius} min={0} max={24} unit="px" onChange={(content_radius) => onChange({ content_radius })} />
			<label className="flex flex-col gap-1.5">
				<span className="text-xs text-[#334155]">Font</span>
				<select
					value={design.font_family}
					onChange={(e) => onChange({ font_family: e.target.value })}
					className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1.5 text-xs text-[#0F172A] outline-none cursor-pointer"
				>
					{FONT_OPTIONS.map((f) => (
						<option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
							{f.label}
						</option>
					))}
				</select>
			</label>
		</Accordion>
	);
}

export default function SettingsPanel({
	editor,
	design,
	onDesignChange,
}: {
	editor: Editor;
	design: EmailDesign;
	onDesignChange: (patch: Partial<EmailDesign>) => void;
}) {
	const ctx = useEditorState({
		editor,
		selector: ({ editor: e }) => {
			const { selection } = e.state;
			const node = selection instanceof NodeSelection ? selection.node : null;
			const $from = selection.$from;
			const sectionNode = $from.depth >= 1 ? $from.node(1) : node;
			const section = sectionNode ? SECTION_BY_NODE[sectionNode.type.name] : undefined;
			return {
				kind: node?.type.name,
				attrs: node?.attrs,
				section,
				sectionPos: section && $from.depth >= 1 ? $from.before(1) : selection.from,
				sectionAttrs: sectionNode?.attrs as SectionStyle | undefined,
			};
		},
	});

	const inner = ctx.sectionAttrs ? design.content_width - ctx.sectionAttrs.padding_x * 2 : design.content_width;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-2">
				<span className="text-[11px] text-[#64748B]">Jump to section</span>
				<div className="flex rounded-md bg-[#F1F5F9] p-0.5">
					{(Object.keys(SECTION_LABELS) as SectionName[]).map((name) => (
						<button
							key={name}
							type="button"
							onClick={() => focusSection(editor, name)}
							className={`flex-1 rounded-[5px] py-1 text-xs cursor-pointer ${
								ctx.section === name
									? "bg-white font-medium text-[#0F172A] shadow-sm"
									: "text-[#64748B] hover:text-[#0F172A]"
							}`}
						>
							{SECTION_LABELS[name]}
						</button>
					))}
				</div>
			</div>

			{ctx.kind === "emailImage" && ctx.attrs ? (
				<ImageSettings editor={editor} attrs={ctx.attrs as EmailImageAttrs} maxWidth={inner} />
			) : ctx.kind === "emailButton" && ctx.attrs ? (
				<ButtonSettings editor={editor} attrs={ctx.attrs as EmailButtonAttrs} />
			) : null}

			{/* The section around the selection, so its spacing and colors stay
			    reachable even when it holds only an image or button */}
			{ctx.section && ctx.sectionAttrs ? (
				<div className={ctx.kind ? "border-t border-[#F1F5F9] pt-5" : ""}>
				<SectionSettings
					editor={editor}
					name={ctx.section}
					pos={ctx.sectionPos}
					attrs={ctx.sectionAttrs}
				/>
				</div>
			) : (
				<p className="text-xs text-[#64748B]">
					Click into the header, body or footer to style it.
				</p>
			)}

			<EmailSettings design={design} onChange={onDesignChange} />
		</div>
	);
}
