"use client";

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { GripVertical, Trash2 } from "lucide-react";
import type { EmailButtonAttrs } from "./extensions";

const JUSTIFY = { left: "justify-start", center: "justify-center", right: "justify-end" };

// A call-to-action button. Click it to edit text, link and colors in the
// settings panel; drag the grip to move it.
export default function ButtonView({ node, selected, deleteNode, editor }: NodeViewProps) {
	const a = node.attrs as EmailButtonAttrs;
	const editable = editor.isEditable;

	return (
		<NodeViewWrapper
			className={`group/button relative mt-1 mb-4 flex ${JUSTIFY[a.align] ?? "justify-start"}`}
		>
			<span
				className={`relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold ${
					a.full_width ? "w-full" : ""
				} ${selected ? "outline-2 outline-offset-2 outline-[#0091FE]" : ""}`}
				style={{ background: a.background, color: a.color, borderRadius: a.radius }}
			>
				{a.label || "Button"}
			</span>
			{editable && (
				<div
					contentEditable={false}
					className="absolute -left-3 top-1/2 hidden -translate-y-1/2 flex-col gap-1 group-hover/button:flex"
				>
					<span
						data-drag-handle=""
						draggable
						title="Drag to move"
						className="flex h-6 w-6 items-center justify-center rounded bg-white text-[#64748B] shadow ring-1 ring-black/5 cursor-grab"
					>
						<GripVertical size={13} />
					</span>
					{selected && (
						<button
							type="button"
							title="Remove button"
							onMouseDown={(e) => e.preventDefault()}
							onClick={deleteNode}
							className="flex h-6 w-6 items-center justify-center rounded bg-white text-[#DC2626] shadow ring-1 ring-black/5 cursor-pointer"
						>
							<Trash2 size={13} />
						</button>
					)}
				</div>
			)}
		</NodeViewWrapper>
	);
}
