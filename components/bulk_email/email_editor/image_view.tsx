"use client";

import { useRef, useState } from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Crop,
	GripVertical,
	ImageIcon,
	LoaderCircle,
	Trash2,
	Upload,
} from "lucide-react";
import type { EmailImageAttrs, ImageAlign } from "./extensions";
import { useImagePicker } from "./use_image_picker";
import CropDialog from "./crop_dialog";

const MIN_WIDTH = 40;

const SIZE_PRESETS = [
	{ label: "S", ratio: 0.25 },
	{ label: "M", ratio: 0.5 },
	{ label: "L", ratio: 0.75 },
	{ label: "Full", ratio: 1 },
];

const JUSTIFY: Record<ImageAlign, string> = {
	left: "justify-start",
	center: "justify-center",
	right: "justify-end",
};

const toolButton =
	"h-7 min-w-7 px-1.5 flex items-center justify-center rounded text-[11px] text-[#334155] hover:bg-[#F1F5F9] cursor-pointer";

// A block image in the email: drag the grip to move it (into any section),
// drag a corner to resize, and use the floating bar for quick changes.
export default function ImageView({
	node,
	selected,
	updateAttributes,
	deleteNode,
	editor,
}: NodeViewProps) {
	const attrs = node.attrs as EmailImageAttrs;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [liveWidth, setLiveWidth] = useState<number | null>(null);
	const [cropping, setCropping] = useState(false);
	const picker = useImagePicker((src) => updateAttributes({ src }));
	const editable = editor.isEditable;

	const maxWidth = () => wrapperRef.current?.clientWidth ?? 600;

	// Corner drag: right-side corners grow to the right, left-side to the left.
	// Centered images grow both ways, so the pointer moves half as far.
	const startResize = (e: React.PointerEvent, side: 1 | -1) => {
		e.preventDefault();
		e.stopPropagation();
		const img = (e.currentTarget.parentElement as HTMLElement).querySelector("img");
		const startX = e.clientX;
		const startWidth = img?.getBoundingClientRect().width ?? maxWidth();
		const max = maxWidth();
		const factor = attrs.align === "center" ? 2 : 1;
		let width = startWidth;

		const move = (ev: PointerEvent) => {
			width = Math.round(
				Math.min(max, Math.max(MIN_WIDTH, startWidth + (ev.clientX - startX) * side * factor)),
			);
			setLiveWidth(width);
		};
		const up = () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			setLiveWidth(null);
			// One attribute update per drag keeps undo to a single step
			updateAttributes({ width: width >= max - 2 ? null : width });
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
	};

	const width = liveWidth ?? attrs.width;
	const shown = width ? `${width}px` : "100%";

	return (
		<NodeViewWrapper
			ref={wrapperRef}
			className={`group/image relative flex mb-3 ${JUSTIFY[attrs.align] ?? "justify-center"}`}
			data-email-image-view=""
		>
			{picker.input}
			<div className="relative max-w-full" style={{ width: shown }}>
				{attrs.src ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={attrs.src}
						alt={attrs.alt}
						draggable={false}
						className="block w-full h-auto select-none"
						style={{
							borderRadius: attrs.radius,
							border: attrs.border_width
								? `${attrs.border_width}px solid ${attrs.border_color}`
								: undefined,
						}}
					/>
				) : (
					<div className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-2 bg-[#E2E8F0] text-[#64748B]">
						<ImageIcon size={26} />
						<span className="text-xs">No image yet</span>
					</div>
				)}

				{editable && (
					<>
						{/* Selection / hover frame */}
						<div
							className={`pointer-events-none absolute inset-0 ${
								selected
									? "outline-2 outline-[#0091FE]"
									: "group-hover/image:outline-1 group-hover/image:outline-dashed group-hover/image:outline-[#0091FE]"
							}`}
						/>

						{/* Drag grip — ProseMirror moves the node, across sections too */}
						<div
							data-drag-handle=""
							draggable
							title="Drag to move"
							className="absolute -left-3 top-2 hidden h-7 w-6 items-center justify-center rounded bg-white text-[#64748B] shadow ring-1 ring-black/5 cursor-grab active:cursor-grabbing group-hover/image:flex"
						>
							<GripVertical size={14} />
						</div>

						{picker.uploading && (
							<div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 text-xs text-white">
								<LoaderCircle size={16} className="animate-spin" />
								Uploading…
							</div>
						)}

						{selected && (
							<>
								{(
									[
										["-left-1.5 -top-1.5 cursor-nwse-resize", -1],
										["-right-1.5 -top-1.5 cursor-nesw-resize", 1],
										["-left-1.5 -bottom-1.5 cursor-nesw-resize", -1],
										["-right-1.5 -bottom-1.5 cursor-nwse-resize", 1],
									] as const
								).map(([pos, side]) => (
									<span
										key={pos}
										onPointerDown={(e) => startResize(e, side)}
										className={`absolute h-3 w-3 rounded-sm border-2 border-white bg-[#0091FE] shadow ${pos}`}
									/>
								))}

								{liveWidth && (
									<span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
										{liveWidth}px
									</span>
								)}

								{/* Floating quick bar */}
								<div
									contentEditable={false}
									className="absolute left-1/2 -top-11 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-md bg-white p-0.5 shadow-md ring-1 ring-black/5"
								>
									{(["left", "center", "right"] as ImageAlign[]).map((a) => {
										const Icon = { left: AlignLeft, center: AlignCenter, right: AlignRight }[a];
										return (
											<button
												key={a}
												type="button"
												title={`Align ${a}`}
												onMouseDown={(e) => e.preventDefault()}
												onClick={() => updateAttributes({ align: a })}
												className={`${toolButton} ${attrs.align === a ? "bg-[#E6F2FF] text-[#0091FE]" : ""}`}
											>
												<Icon size={14} />
											</button>
										);
									})}
									<span className="mx-0.5 h-4 w-px bg-[#E2E8F0]" />
									{SIZE_PRESETS.map((p) => (
										<button
											key={p.label}
											type="button"
											title={p.ratio === 1 ? "Full width" : `${p.ratio * 100}% width`}
											onMouseDown={(e) => e.preventDefault()}
											onClick={() =>
												updateAttributes({
													width: p.ratio === 1 ? null : Math.round(maxWidth() * p.ratio),
												})
											}
											className={toolButton}
										>
											{p.label}
										</button>
									))}
									<span className="mx-0.5 h-4 w-px bg-[#E2E8F0]" />
									<button
										type="button"
										title="Crop"
										disabled={!attrs.src}
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => setCropping(true)}
										className={toolButton}
									>
										<Crop size={14} />
									</button>
									<button
										type="button"
										title="Replace from device"
										onMouseDown={(e) => e.preventDefault()}
										onClick={picker.pick}
										className={toolButton}
									>
										<Upload size={14} />
									</button>
									<button
										type="button"
										title="Remove image"
										onMouseDown={(e) => e.preventDefault()}
										onClick={deleteNode}
										className={`${toolButton} text-[#DC2626] hover:bg-red-50`}
									>
										<Trash2 size={14} />
									</button>
								</div>
							</>
						)}
					</>
				)}
			</div>
			{editable && attrs.src && (
				<CropDialog
					src={attrs.src}
					open={cropping}
					onClose={() => setCropping(false)}
					onCropped={(src) => updateAttributes({ src })}
				/>
			)}
		</NodeViewWrapper>
	);
}
