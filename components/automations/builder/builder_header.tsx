"use client";

import Link from "next/link";
import { ArrowLeft, PencilLine, Redo2, Undo2 } from "lucide-react";

export const headerIconButton =
	"h-10 w-10 flex items-center justify-center rounded-lg bg-white text-[#0091FE] hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

export function UndoRedo({
	onUndo,
	onRedo,
	canUndo,
	canRedo,
}: {
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
}) {
	return (
		<>
			<button
				aria-label="Undo"
				title="Undo"
				onClick={onUndo}
				disabled={!canUndo}
				className={headerIconButton}
			>
				<Undo2 size={16} />
			</button>
			<button
				aria-label="Redo"
				title="Redo"
				onClick={onRedo}
				disabled={!canRedo}
				className={headerIconButton}
			>
				<Redo2 size={16} />
			</button>
		</>
	);
}

// Blue full-width header used by the workflow and email builders.
export default function BuilderHeader({
	backHref,
	title,
	onTitleChange,
	editableIcon = true,
	center,
	actions,
	cta,
}: {
	backHref: string;
	title: string;
	onTitleChange: (title: string) => void;
	editableIcon?: boolean;
	center?: React.ReactNode;
	actions?: React.ReactNode;
	cta: React.ReactNode;
}) {
	return (
		<header className="sticky top-0 z-30 bg-[#0091FE] px-4 md:px-12 py-4 md:h-29 flex items-center">
			<div className="w-full flex max-md:flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3 min-w-0">
					<Link
						href={backHref}
						aria-label="Back"
						className="p-1 rounded text-white hover:bg-white/10"
					>
						<ArrowLeft size={22} />
					</Link>
					<label className="flex items-center gap-3 h-11 md:h-14 min-w-56 md:min-w-70 max-w-[60vw] md:max-w-md rounded-lg bg-white px-4 md:px-6 cursor-text">
						<input
							aria-label="Name"
							value={title}
							onChange={(e) => onTitleChange(e.target.value)}
							// Grow with the name instead of clipping it
							style={{ width: `${Math.max(title.length, 10) + 1}ch` }}
							className={`flex-1 min-w-0 max-w-full bg-transparent text-lg md:text-xl font-medium text-[#0091FE] outline-none ${editableIcon ? "" : "text-center"}`}
						/>
						{editableIcon && <PencilLine size={20} color="#0091FE" />}
					</label>
				</div>
				{center}
				<div className="flex items-center gap-2 md:gap-6">
					<div className="flex items-center gap-2">{actions}</div>
					{cta}
				</div>
			</div>
		</header>
	);
}

export const headerCta =
	"h-11 md:h-14 rounded-full bg-white px-6 md:px-12 text-sm font-medium text-[#0091FE] hover:bg-white/90 cursor-pointer";
