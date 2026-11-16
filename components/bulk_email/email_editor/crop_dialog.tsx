"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/custom/common/customButton";
import { useUploadEmailImage } from "@/hooks/bulk_email/images";
import { EMAIL_IMAGE_MAX_MB } from "@/services/bulk_email/images";
import { Bone } from "../skeletons";

// Crop box as fractions (0–1) of the image, so it survives any display size
interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

type Handle = "move" | "nw" | "ne" | "sw" | "se";

const ASPECTS: { label: string; ratio: number | null }[] = [
	{ label: "Free", ratio: null },
	{ label: "Square", ratio: 1 },
	{ label: "16:9", ratio: 16 / 9 },
	{ label: "4:3", ratio: 4 / 3 },
	{ label: "Banner 3:1", ratio: 3 },
];

const MIN = 0.05;
// Keep crops email-friendly: wide enough for retina, small enough to load fast
const MAX_OUTPUT_WIDTH = 1600;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Largest centered box with the given pixel aspect ratio
const fitAspect = (ratio: number, natW: number, natH: number): Rect => {
	const w = Math.min(1, (ratio * natH) / natW);
	const h = Math.min(1, natW / (ratio * natH));
	return { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
	new Promise<Blob>((resolve, reject) =>
		canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't create the cropped image"))), type, quality),
	);

interface CropDialogProps {
	src: string;
	open: boolean;
	onClose: () => void;
	// Receives the uploaded URL of the cropped copy
	onCropped: (url: string) => void;
}

// Mounted only while open (and per image), so every crop starts fresh
export default function CropDialog(props: CropDialogProps) {
	if (!props.open || !props.src) return null;
	return <CropWindow key={props.src} {...props} />;
}

function CropWindow({ src, onClose, onCropped }: CropDialogProps) {
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [natural, setNatural] = useState({ w: 0, h: 0 });
	const [rect, setRect] = useState<Rect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
	const [aspect, setAspect] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const boxRef = useRef<HTMLDivElement>(null);
	const sourceBlob = useRef<Blob | null>(null);
	const upload = useUploadEmailImage();

	// Fetch the image as a blob first: drawing a cross-origin image on a canvas
	// is only allowed when its host sends CORS headers, so check that up front.
	useEffect(() => {
		let url: string | null = null;
		let cancelled = false;
		fetch(src, { mode: "cors", cache: "no-cache" })
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.blob();
			})
			.then((blob) => {
				if (cancelled) return;
				sourceBlob.current = blob;
				url = URL.createObjectURL(blob);
				setBlobUrl(url);
			})
			.catch(() => {
				if (!cancelled)
					setLoadError(
						"This image's website doesn't allow editing. Upload the image from your device, then crop it.",
					);
			});
		return () => {
			cancelled = true;
			if (url) URL.revokeObjectURL(url);
		};
	}, [src]);

	const startDrag = (e: React.PointerEvent, handle: Handle) => {
		e.preventDefault();
		e.stopPropagation();
		const box = boxRef.current?.getBoundingClientRect();
		if (!box) return;
		const start = { x: e.clientX, y: e.clientY };
		const from = rect;
		// Height (as a fraction) that keeps the locked aspect for a given width
		const hFor = (w: number) => (aspect ? (w * natural.w) / (natural.h * aspect) : null);

		const move = (ev: PointerEvent) => {
			const dx = (ev.clientX - start.x) / box.width;
			const dy = (ev.clientY - start.y) / box.height;
			if (handle === "move") {
				setRect({
					...from,
					x: clamp(from.x + dx, 0, 1 - from.w),
					y: clamp(from.y + dy, 0, 1 - from.h),
				});
				return;
			}
			const west = handle.includes("w");
			const north = handle.includes("n");
			// The opposite corner stays put
			const anchorX = west ? from.x + from.w : from.x;
			const anchorY = north ? from.y + from.h : from.y;
			let w = clamp(west ? from.w - dx : from.w + dx, MIN, west ? anchorX : 1 - anchorX);
			let h = clamp(north ? from.h - dy : from.h + dy, MIN, north ? anchorY : 1 - anchorY);
			const locked = hFor(w);
			if (locked != null) {
				const maxH = north ? anchorY : 1 - anchorY;
				h = Math.min(locked, maxH);
				// Shrink the width back if the height hit the edge
				if (locked > maxH && aspect) w = (h * natural.h * aspect) / natural.w;
			}
			setRect({ x: west ? anchorX - w : anchorX, y: north ? anchorY - h : anchorY, w, h });
		};
		const up = () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
	};

	const pickAspect = (ratio: number | null) => {
		setAspect(ratio);
		if (ratio && natural.w) setRect(fitAspect(ratio, natural.w, natural.h));
	};

	const outW = Math.round(rect.w * natural.w);
	const outH = Math.round(rect.h * natural.h);

	const save = async () => {
		const blob = sourceBlob.current;
		if (!blob || !natural.w) return;
		setSaving(true);
		try {
			const bitmap = await createImageBitmap(blob);
			const scale = Math.min(1, MAX_OUTPUT_WIDTH / outW);
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(outW * scale));
			canvas.height = Math.max(1, Math.round(outH * scale));
			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Couldn't create the cropped image");
			ctx.drawImage(
				bitmap,
				rect.x * natural.w,
				rect.y * natural.h,
				outW,
				outH,
				0,
				0,
				canvas.width,
				canvas.height,
			);
			// PNG keeps transparency; photos go out as JPEG to stay small
			const keepPng = blob.type === "image/png" || blob.type === "image/gif" || blob.type === "image/webp";
			let out = await canvasToBlob(canvas, keepPng ? "image/png" : "image/jpeg", 0.9);
			if (out.size > EMAIL_IMAGE_MAX_MB * 1024 * 1024) {
				out = await canvasToBlob(canvas, "image/jpeg", 0.8);
			}
			const ext = out.type === "image/png" ? "png" : "jpg";
			const url = await upload.mutateAsync(new File([out], `cropped.${ext}`, { type: out.type }));
			onCropped(url);
			onClose();
		} catch {
			// Upload errors are toasted by the mutation
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open onOpenChange={(o) => !o && !saving && onClose()}>
			<DialogContent className="sm:max-w-[760px] p-6 gap-4 flex flex-col rounded-2xl">
				<div className="flex flex-col gap-1">
					<DialogTitle className="text-lg font-normal text-[#334155]">Crop image</DialogTitle>
					<DialogDescription className="text-[13px] text-[#64748B]">
						Drag the box to move it and its corners to resize. Saving uploads a
						cropped copy; the original isn&apos;t changed.
					</DialogDescription>
				</div>

				<div className="flex flex-wrap gap-1.5">
					{ASPECTS.map((a) => (
						<button
							key={a.label}
							type="button"
							onClick={() => pickAspect(a.ratio)}
							className={`rounded-full px-3 py-1 text-xs cursor-pointer ${
								aspect === a.ratio
									? "bg-[#0091FE] text-white"
									: "bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]"
							}`}
						>
							{a.label}
						</button>
					))}
				</div>

				<div className="flex min-h-64 items-center justify-center rounded-lg bg-[#0F172A] p-4">
					{loadError ? (
						<p className="max-w-sm text-center text-sm text-white/80">{loadError}</p>
					) : !blobUrl ? (
						<Bone className="h-56 w-full max-w-md bg-white/10" />
					) : (
						<div ref={boxRef} className="relative select-none overflow-hidden touch-none">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={blobUrl}
								alt=""
								draggable={false}
								onLoad={(e) => {
									const img = e.currentTarget;
									setNatural({ w: img.naturalWidth, h: img.naturalHeight });
								}}
								className="block max-h-[55vh] max-w-full"
							/>
							<div
								onPointerDown={(e) => startDrag(e, "move")}
								className="absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.6)]"
								style={{
									left: `${rect.x * 100}%`,
									top: `${rect.y * 100}%`,
									width: `${rect.w * 100}%`,
									height: `${rect.h * 100}%`,
								}}
							>
								{/* Rule-of-thirds guides */}
								<div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
									{Array.from({ length: 9 }).map((_, i) => (
										<span key={i} className="border border-white/25" />
									))}
								</div>
								{(
									[
										["nw", "-left-2 -top-2 cursor-nwse-resize"],
										["ne", "-right-2 -top-2 cursor-nesw-resize"],
										["sw", "-left-2 -bottom-2 cursor-nesw-resize"],
										["se", "-right-2 -bottom-2 cursor-nwse-resize"],
									] as const
								).map(([handle, pos]) => (
									<span
										key={handle}
										onPointerDown={(e) => startDrag(e, handle)}
										className={`absolute h-4 w-4 rounded-sm border-2 border-[#0091FE] bg-white ${pos}`}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="flex items-center justify-between gap-3">
					<span className="font-mono text-xs text-[#64748B]">
						{natural.w ? `${outW} × ${outH}px` : ""}
					</span>
					<div className="flex gap-2">
						<CustomButton
							variant="ghost"
							onClick={onClose}
							disabled={saving}
							className="rounded-lg min-h-9 px-4 text-[13px] font-normal"
						>
							Cancel
						</CustomButton>
						<CustomButton
							onClick={save}
							disabled={saving || !blobUrl || !natural.w}
							className="rounded-lg border-0 min-h-9 px-4 text-[13px] font-normal"
						>
							{saving && <LoaderCircle size={14} className="animate-spin" />}
							{saving ? "Saving…" : "Save cropped image"}
						</CustomButton>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
