"use client";

import { useRef } from "react";
import { AlignCenter, AlignLeft, AlignRight, ChevronRight } from "lucide-react";
import { EmailContent, EmailImageSettings } from "@/types/bulk_email";
import {
	Accordion,
	ColorField,
	Segmented,
	Slider,
	TextField,
	Toggle,
} from "./controls";

export function StylesInspector({
	content,
	onChange,
}: {
	content: EmailContent;
	onChange: (patch: Partial<EmailContent>) => void;
}) {
	return (
		<div className="flex flex-col">
			<div className="border-b border-[#F1F5F9] px-4 py-4">
				<h3 className="text-xs font-semibold text-[#0F172A]">Styles</h3>
			</div>
			<div className="flex flex-col gap-5 px-4 py-4">
				<ColorField
					label="Background color"
					value={content.background_color}
					onChange={(background_color) => onChange({ background_color })}
				/>
				<Accordion title="Buttons">
					<ColorField
						label="Text color"
						value={content.button_text_color}
						onChange={(button_text_color) =>
							onChange({ button_text_color })
						}
					/>
					<ColorField
						label="Background"
						value={content.button_background_color}
						onChange={(button_background_color) =>
							onChange({ button_background_color })
						}
					/>
				</Accordion>
			</div>
		</div>
	);
}

export function ImageInspector({
	image,
	onChange,
	onBack,
}: {
	image: EmailImageSettings;
	onChange: (patch: Partial<EmailImageSettings>) => void;
	onBack: () => void;
}) {
	const fileRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex flex-col">
			<nav className="flex items-center gap-1 border-b border-[#F1F5F9] px-4 py-4 text-xs">
				<button
					onClick={onBack}
					className="text-[#64748B] hover:text-[#0F172A] cursor-pointer"
				>
					Styles
				</button>
				<ChevronRight size={12} color="#94A3B8" />
				<span className="text-[#64748B]">Content</span>
				<ChevronRight size={12} color="#94A3B8" />
				<span className="font-semibold text-[#0F172A]">Image</span>
			</nav>

			<div className="flex flex-col gap-5 px-4 py-4">
				<div className="flex gap-2">
					<button
						onClick={() => fileRef.current?.click()}
						className="flex-1 rounded-md border border-[#E2E8F0] bg-white py-1.5 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer"
					>
						Replace
					</button>
					<button
						onClick={() => onChange({ url: "" })}
						disabled={!image.url}
						className="flex-1 rounded-md border border-[#E2E8F0] bg-white py-1.5 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Remove
					</button>
					<input
						ref={fileRef}
						type="file"
						accept="image/*"
						hidden
						onChange={(e) => {
							const file = e.target.files?.[0];
							// TODO: upload the file once there's an endpoint; this URL only lives in this tab
							if (file) onChange({ url: URL.createObjectURL(file) });
							e.target.value = "";
						}}
					/>
				</div>

				<TextField
					label="URL"
					placeholder="https://"
					value={image.link}
					onChange={(link) => onChange({ link })}
				/>

				<Toggle
					label="Show caption"
					checked={image.show_caption}
					onChange={(show_caption) => onChange({ show_caption })}
				/>
				{image.show_caption && (
					<TextField
						label="Caption"
						value={image.caption}
						onChange={(caption) => onChange({ caption })}
					/>
				)}

				<div className="flex flex-col gap-2">
					<Segmented
						label="Width"
						value={image.width_mode}
						options={[
							{ value: "fixed", label: "Fixed" },
							{ value: "full", label: "Full" },
						]}
						onChange={(width_mode) => onChange({ width_mode })}
					/>
					{image.width_mode === "fixed" && (
						<Slider
							value={image.width}
							min={10}
							max={100}
							unit="%"
							onChange={(width) => onChange({ width })}
						/>
					)}
				</div>

				<Segmented
					label="Crop"
					value={image.crop}
					options={[
						{ value: "original", label: "Original" },
						{ value: "square", label: "Square" },
						{ value: "wide", label: "Wide" },
					]}
					onChange={(crop) => onChange({ crop })}
				/>

				<Segmented
					label="Corner radius"
					value={image.radius}
					options={[
						{ value: "none", label: "None" },
						{ value: "small", label: "Small" },
						{ value: "large", label: "Large" },
					]}
					onChange={(radius) => onChange({ radius })}
				/>

				<Segmented
					label="Alignment"
					value={image.align}
					options={[
						{ value: "left", label: <AlignLeft size={14} />, title: "Left" },
						{
							value: "center",
							label: <AlignCenter size={14} />,
							title: "Center",
						},
						{ value: "right", label: <AlignRight size={14} />, title: "Right" },
					]}
					onChange={(align) => onChange({ align })}
				/>

				<Accordion title="Border">
					<ColorField
						label="Border color"
						value={image.border_color}
						onChange={(border_color) => onChange({ border_color })}
					/>
					<Segmented
						label="Border width"
						value={image.border_width}
						options={[
							{ value: "none", label: "None" },
							{ value: "thin", label: "Thin" },
							{ value: "thick", label: "Thick" },
						]}
						onChange={(border_width) => onChange({ border_width })}
					/>
				</Accordion>

				<Accordion title="Accessibility">
					<TextField
						label="Describe this image for screen readers"
						value={image.alt}
						onChange={(alt) => onChange({ alt })}
					/>
				</Accordion>

				<Accordion title="Advanced">
					<Toggle
						label="Wrap text"
						checked={image.wrap_text}
						onChange={(wrap_text) => onChange({ wrap_text })}
					/>
					<Toggle
						label="Optimize image"
						hint="Enabling this will improve loading times."
						checked={image.optimize}
						onChange={(optimize) => onChange({ optimize })}
					/>
					<Slider
						label="Margin"
						value={image.margin}
						min={0}
						max={48}
						unit="px"
						onChange={(margin) => onChange({ margin })}
					/>
				</Accordion>
			</div>
		</div>
	);
}
