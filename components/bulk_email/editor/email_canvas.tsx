"use client";

import { useEffect, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { EmailContent } from "@/types/bulk_email";

const CROP_ASPECT = { original: "520 / 256", square: "1 / 1", wide: "16 / 9" };
const RADIUS = { none: 0, small: 8, large: 16 };
const BORDER = { none: 0, thin: 1, thick: 3 };
const ALIGN = { left: "flex-start", center: "center", right: "flex-end" };

export const countWords = (html: string) =>
	html
		.replace(/<[^>]+>/g, " ")
		.split(/\s+/)
		.filter(Boolean).length;

function EmailImage({
	image,
	selected,
	onSelect,
}: {
	image: EmailContent["image"];
	selected: boolean;
	onSelect?: () => void;
}) {
	const style: React.CSSProperties = {
		width: image.width_mode === "full" ? "100%" : `${image.width}%`,
		aspectRatio: CROP_ASPECT[image.crop],
		borderRadius: RADIUS[image.radius],
		border: BORDER[image.border_width]
			? `${BORDER[image.border_width]}px solid #${image.border_color}`
			: undefined,
	};

	return (
		<figure
			className="flex flex-col"
			style={{ alignItems: ALIGN[image.align], padding: image.margin }}
		>
			<button
				type="button"
				onClick={onSelect}
				disabled={!onSelect}
				aria-label="Edit image"
				className={`relative block overflow-hidden outline-offset-2 disabled:cursor-default ${
					onSelect ? "cursor-pointer" : ""
				} ${selected ? "outline-2 outline-[#0091FE]" : onSelect ? "hover:outline-2 hover:outline-[#0091FE]/50" : ""}`}
				style={style}
			>
				{image.url ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={image.url}
						alt={image.alt}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="h-full w-full bg-linear-to-br from-[#BEE3E6] to-[#7CC4CB] flex flex-col items-center justify-center gap-2 text-[#0F6973]">
						<ImageIcon size={28} />
						{onSelect && (
							<span className="text-xs">Click to add an image</span>
						)}
					</div>
				)}
			</button>
			{image.show_caption && (
				<figcaption className="mt-2 text-xs text-[#64748B]">
					{image.caption || "Add a caption"}
				</figcaption>
			)}
		</figure>
	);
}

export default function EmailCanvas({
	content,
	editable = false,
	imageSelected = false,
	onHtmlChange,
	onSelectImage,
	onSelectText,
	size = "lg",
}: {
	content: EmailContent;
	editable?: boolean;
	imageSelected?: boolean;
	onHtmlChange?: (html: string) => void;
	onSelectImage?: () => void;
	onSelectText?: () => void;
	size?: "md" | "lg";
}) {
	const bodyRef = useRef<HTMLDivElement>(null);

	// The body is uncontrolled while editing; only push HTML in when it changed
	// from outside (e.g. switching template) so the caret isn't reset.
	useEffect(() => {
		const el = bodyRef.current;
		if (el && el.innerHTML !== content.html) el.innerHTML = content.html;
	}, [content.html]);

	const cssVars = {
		"--btn-bg": `#${content.button_background_color}`,
		"--btn-fg": `#${content.button_text_color}`,
	} as React.CSSProperties;

	return (
		<div
			className="relative w-full flex flex-col items-center rounded-md md:px-10 px-3 pt-10 pb-6"
			style={{ backgroundColor: `#${content.background_color}` }}
		>
			<div
				className={`w-full bg-white shadow-sm ${size === "lg" ? "max-w-[520px]" : "max-w-[480px] md:px-10 px-4 pt-6 pb-4"}`}
				style={cssVars}
			>
				<EmailImage
					image={content.image}
					selected={imageSelected}
					onSelect={onSelectImage}
				/>
				<div
					ref={bodyRef}
					data-email-editor
					contentEditable={editable}
					suppressContentEditableWarning
					onFocus={onSelectText}
					onInput={(e) => onHtmlChange?.(e.currentTarget.innerHTML)}
					className={`flex flex-col gap-4 text-sm leading-6 text-[#334155] outline-none ${
						size === "lg" ? "px-8 py-8" : "py-6"
					} [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-[#0F172A] [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#0F172A] [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0F172A] [&_a]:text-[#0F6973] [&_a]:underline [&_a.cta]:inline-block [&_a.cta]:no-underline [&_a.cta]:rounded [&_a.cta]:px-5 [&_a.cta]:py-2 [&_a.cta]:text-sm [&_a.cta]:font-medium [&_a.cta]:bg-(--btn-bg) [&_a.cta]:text-(--btn-fg)`}
				/>
				{size === "md" && (
					<div className="flex flex-col items-center gap-1 border-t border-[#F1F5F9] pt-4 text-[11px] text-[#94A3B8]">
						<span>{"{{ address }}"}</span>
						<span>Unsubscribe · Preferences</span>
					</div>
				)}
			</div>

			{size === "lg" && (
				<div className="flex flex-col items-center gap-1 pt-6 text-[11px] text-white/80">
					<span>{"{{ address }}"}</span>
					<span>
						<span className="underline">Unsubscribe</span> ·{" "}
						<span className="underline">Preferences</span>
					</span>
				</div>
			)}

			<div className="mt-6 flex items-center gap-1 rounded-full bg-white px-4 py-1 shadow-sm">
				<span className="text-[11px] text-[#64748B]">Built with</span>
				<span className="text-sm font-semibold text-[#0091FE]">CRM360</span>
			</div>

			<span className="absolute bottom-3 right-3 rounded bg-black/20 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
				{countWords(content.html)} words
			</span>
		</div>
	);
}
