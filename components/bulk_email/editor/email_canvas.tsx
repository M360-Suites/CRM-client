"use client";

import { useEffect, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { EmailContent, EmailImageSettings } from "@/types/bulk_email";

const RADIUS = { none: 0, curved: 8, round: 24 };
const BORDER = { none: 0, normal: 1, large: 4 };
const ALIGN = { left: "flex-start", center: "center", right: "flex-end" };

export const countWords = (html: string) =>
	html
		.replace(/<[^>]+>/g, " ")
		.split(/\s+/)
		.filter(Boolean).length;

const radiusOf = (image: EmailImageSettings) =>
	image.radius === "custom" ? image.radius_px : RADIUS[image.radius];

const borderOf = (image: EmailImageSettings) =>
	image.border_width === "custom"
		? image.border_px
		: BORDER[image.border_width];

function EmailImage({
	image,
	selected,
	onSelect,
	defaultAspect,
}: {
	image: EmailImageSettings;
	selected: boolean;
	onSelect?: () => void;
	defaultAspect: string;
}) {
	const border = borderOf(image);
	const style: React.CSSProperties = {
		width: image.width_mode === "full" ? "100%" : image.width,
		maxWidth: "100%",
		aspectRatio: image.crop === "square" ? "1 / 1" : defaultAspect,
		borderRadius: radiusOf(image),
		border: border ? `${border}px solid #${image.border_color}` : undefined,
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
					<div className="h-full w-full bg-[#E2E8F0] flex flex-col items-center justify-center gap-2 text-[#64748B]">
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

const BODY_STYLES =
	"flex flex-col gap-5 text-[13px] leading-[21px] text-[#334155] outline-none [&_h1]:text-[28px] [&_h1]:leading-9 [&_h1]:text-[#0F172A] [&_h2]:text-2xl [&_h2]:leading-8 [&_h2]:text-[#0F172A] [&_h3]:text-lg [&_h3]:text-[#0F172A] [&_a]:underline [&_a.cta]:inline-flex [&_a.cta]:items-center [&_a.cta]:no-underline [&_a.cta]:rounded-[3px] [&_a.cta]:bg-(--btn-bg) [&_a.cta]:text-(--btn-fg)";

export default function EmailCanvas({
	content,
	editable = false,
	imageSelected = false,
	onHtmlChange,
	onSelectImage,
	onSelectText,
	size = "lg",
	className = "",
}: {
	content: EmailContent;
	editable?: boolean;
	imageSelected?: boolean;
	onHtmlChange?: (html: string) => void;
	onSelectImage?: () => void;
	onSelectText?: () => void;
	// lg: full-bleed template editor card, md: broadcast/preview card
	size?: "md" | "lg";
	className?: string;
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

	const lg = size === "lg";

	return (
		<div
			className={`relative w-full flex flex-col items-center md:px-10 px-3 ${lg ? "pt-12 pb-11" : "pt-10 pb-14"} ${className}`}
			style={{ backgroundColor: `#${content.background_color}` }}
		>
			<div
				className={`w-full bg-white ${lg ? "max-w-[520px] shadow-[0_8px_24px_rgba(15,23,42,0.12)]" : "max-w-[480px] md:px-10 px-4 pt-10 pb-10"}`}
				style={cssVars}
			>
				<EmailImage
					image={content.image}
					selected={imageSelected}
					onSelect={onSelectImage}
					defaultAspect={lg ? "520 / 256" : "400 / 192"}
				/>
				<div
					ref={bodyRef}
					data-email-editor
					contentEditable={editable}
					suppressContentEditableWarning
					onFocus={onSelectText}
					onInput={(e) => onHtmlChange?.(e.currentTarget.innerHTML)}
					className={`${BODY_STYLES} ${
						lg
							? "px-8 pt-10 pb-9 [&_a]:text-[#0F172A] [&_a.cta]:h-9 [&_a.cta]:px-5 [&_a.cta]:text-xs [&_a.cta]:font-semibold"
							: "pt-8 [&_h2]:font-serif [&_h1]:font-serif [&_a.cta]:h-8 [&_a.cta]:px-5 [&_a.cta]:text-[13px]"
					}`}
				/>
				{!lg && (
					<div className="mt-14 flex flex-col gap-1 text-xs text-[#0F172A]">
						<span>{"{{ address }}"}</span>
						<span>
							<span className="underline">Unsubscribe</span> ·{" "}
							<span className="underline">Preferences</span>
						</span>
					</div>
				)}
			</div>

			{lg && (
				<div className="flex flex-col items-center gap-1.5 pt-10 text-[11px] text-white">
					<span className="font-mono text-white/80">{"{{ address }}"}</span>
					<span>
						<span className="underline">Unsubscribe</span>
						{"  ·  "}
						<span className="underline">Preferences</span>
					</span>
				</div>
			)}

			<div
				className={`${lg ? "mt-7" : "mt-8"} flex items-center gap-1.5 rounded-[3px] bg-white px-3.5 py-1 text-[#0F172A]`}
			>
				<span className="text-xs font-semibold">Built with</span>
				<span className="text-sm font-bold">CRM360</span>
			</div>

			{!lg && (
				<span className="absolute bottom-5 right-3 rounded-[3px] bg-white px-2.5 py-0.5 text-[10px] text-[#64748B]">
					{countWords(content.html)} words
				</span>
			)}
		</div>
	);
}
