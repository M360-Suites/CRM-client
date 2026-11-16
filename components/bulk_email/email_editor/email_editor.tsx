"use client";

import { useEffect, useRef, useState } from "react";
import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { UploadEmailImage } from "@/services/bulk_email/images";
import { EmailDesign, EmailDoc } from "@/types/bulk_email";
import { ActiveSection } from "./active_section";
import { LoadedDesign } from "./design";
import { emailExtensions } from "./extensions";
import SettingsPanel from "./settings_panel";
import Toolbar from "./toolbar";
import { CanvasSkeleton, SettingsSkeleton } from "../skeletons";

// Canvas typography mirrors lib/email_html.ts so what you see is what's sent
const CANVAS_CSS = `
.email-canvas .ProseMirror { outline: none; }
.email-canvas section[data-email-section] { position: relative; min-height: 44px; transition: box-shadow .15s; }
.email-canvas section[data-email-section]:first-child { border-top-left-radius: var(--card-radius); border-top-right-radius: var(--card-radius); }
.email-canvas section[data-email-section]:last-child { border-bottom-left-radius: var(--card-radius); border-bottom-right-radius: var(--card-radius); }
.email-canvas section[data-email-section]:hover { box-shadow: inset 0 0 0 1px rgba(0,145,254,.45); }
.email-canvas section.is-active-section { box-shadow: inset 0 0 0 2px #0091FE; }
.email-canvas section[data-email-section]::before {
	content: attr(data-email-section); position: absolute; top: 6px; right: 8px; z-index: 5;
	padding: 3px 7px; border-radius: 4px; background: #0091FE; color: #fff;
	font: 600 9px/1 system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase;
	opacity: 0; pointer-events: none; transition: opacity .15s;
}
.email-canvas section[data-email-section]:hover::before, .email-canvas section.is-active-section::before { opacity: 1; }
.email-canvas p { margin: 0 0 12px; font-size: 15px; line-height: 24px; }
.email-canvas h1 { margin: 0 0 16px; font-size: 30px; line-height: 38px; font-weight: 700; }
.email-canvas h2 { margin: 0 0 14px; font-size: 24px; line-height: 32px; font-weight: 700; }
.email-canvas h3 { margin: 0 0 12px; font-size: 19px; line-height: 27px; font-weight: 600; }
.email-canvas ul { list-style: disc; margin: 0 0 12px; padding-left: 24px; }
.email-canvas ol { list-style: decimal; margin: 0 0 12px; padding-left: 24px; }
.email-canvas li p { margin: 0 0 4px; }
.email-canvas blockquote { margin: 0 0 12px; padding-left: 14px; border-left: 3px solid #CBD5E1; }
.email-canvas hr { border: 0; border-top: 1px solid #E2E8F0; margin: 16px 0; }
.email-canvas hr.ProseMirror-selectednode { border-top-color: #0091FE; }
.email-canvas code { font-family: Menlo, Consolas, monospace; background: #F1F5F9; padding: 1px 4px; border-radius: 3px; }
.email-canvas a { color: var(--link-color); text-decoration: underline; }
.email-canvas mark { padding: 0 2px; border-radius: 2px; color: inherit; }
.email-canvas section > :last-child,
.email-canvas section > :last-child > [data-node-view-wrapper] { margin-bottom: 0; }
.email-canvas .ProseMirror-gapcursor:after { border-top-color: #0091FE; }
`;

const imageFiles = (list?: FileList | null) =>
	Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));

export default function EmailEditor({
	initial,
	onChange,
	header,
	side,
}: {
	initial: LoadedDesign;
	// Extra content at the top of the canvas column and the settings column,
	// so the canvas sits right under it instead of below the taller column
	header?: React.ReactNode;
	side?: React.ReactNode;
	// Called with the full design (styles + document) after every change
	onChange: (design: EmailDesign) => void;
}) {
	const [design, setDesign] = useState(initial.design);
	const designRef = useRef(design);
	const onChangeRef = useRef(onChange);
	const editorRef = useRef<Editor | null>(null);
	const [uploads, setUploads] = useState(0);

	useEffect(() => {
		onChangeRef.current = onChange;
	});

	const emit = (doc: unknown) =>
		onChangeRef.current({ ...designRef.current, doc: doc as EmailDoc });

	// Images dropped or pasted from the computer are uploaded, then placed
	const uploadAndInsert = (files: File[], pos?: number) => {
		files.forEach((file) => {
			setUploads((n) => n + 1);
			UploadEmailImage(file)
				.then((src) => {
					const ed = editorRef.current;
					if (!ed) return;
					const node = { type: "emailImage", attrs: { src } };
					if (pos != null) ed.chain().focus().insertContentAt(pos, node).run();
					else ed.chain().focus().insertContent(node).run();
				})
				.catch((err: Error) => toast.error(err.message))
				.finally(() => setUploads((n) => n - 1));
		});
	};

	const editor = useEditor({
		extensions: [...emailExtensions(), ActiveSection],
		content: initial.initial as JSONContent | string,
		immediatelyRender: false,
		editorProps: {
			attributes: { class: "email-doc" },
			handleDrop: (view, event, _slice, moved) => {
				const files = imageFiles(event.dataTransfer?.files);
				if (moved || !files.length) return false;
				event.preventDefault();
				const at = view.posAtCoords({ left: event.clientX, top: event.clientY });
				uploadAndInsert(files, at?.pos);
				return true;
			},
			handlePaste: (_view, event) => {
				const files = imageFiles(event.clipboardData?.files);
				if (!files.length) return false;
				uploadAndInsert(files);
				return true;
			},
		},
		onCreate: ({ editor: ed }) => {
			editorRef.current = ed;
			// Converted or fixed on load: save the result right away
			if (typeof initial.initial === "string" || initial.changed) emit(ed.getJSON());
		},
		onUpdate: ({ editor: ed }) => emit(ed.getJSON()),
	});

	const updateDesign = (patch: Partial<EmailDesign>) => {
		const next = { ...designRef.current, ...patch };
		designRef.current = next;
		setDesign(next);
		if (editor) emit(editor.getJSON());
	};

	return (
		<div className="flex max-lg:flex-col items-start gap-6 w-full">
			<style>{CANVAS_CSS}</style>
			<div className="flex-1 min-w-0 w-full flex flex-col gap-4">
				{header}
				{!editor ? (
					<CanvasSkeleton />
				) : (
				<div className="flex flex-col">
				<div className="sticky top-20 z-30 rounded-t-md border border-[#E2E8F0] bg-white px-2 py-1.5 shadow-sm">
					<Toolbar editor={editor} />
				</div>
				<div
					className="email-canvas relative flex justify-center rounded-b-md border border-t-0 border-[#E2E8F0] px-3 py-10 md:px-10"
					style={{ background: design.background_color }}
				>
					{uploads > 0 && (
						<span className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-[#334155] shadow">
							<LoaderCircle size={12} className="animate-spin" />
							Uploading {uploads > 1 ? `${uploads} images` : "image"}…
						</span>
					)}
					<div
						className="w-full shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
						style={
							{
								maxWidth: design.content_width,
								background: design.content_background,
								borderRadius: design.content_radius,
								fontFamily: design.font_family,
								"--link-color": design.link_color,
								"--card-radius": `${design.content_radius}px`,
							} as React.CSSProperties
						}
					>
						<EditorContent editor={editor} />
					</div>
				</div>
				<p className="mt-2 text-[11px] text-[#94A3B8]">
					Drag images by their grip to move them between sections, drop or paste
					images from your computer, and use {"{{ }}"} for merge tags. An
					unsubscribe link is added to every email automatically.
				</p>
				</div>
				)}
			</div>

			{/* Stretches to the canvas height so the settings card can stick */}
			<div className="lg:w-80 w-full shrink-0 flex flex-col gap-4 lg:self-stretch">
				{side}
				{!editor && <SettingsSkeleton />}
				{editor && (
					<aside className="rounded-md border border-[#E2E8F0] bg-white p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
						<SettingsPanel editor={editor} design={design} onDesignChange={updateDesign} />
					</aside>
				)}
			</div>
		</div>
	);
}
