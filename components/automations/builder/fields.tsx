"use client";

import { ChevronDown } from "lucide-react";

// Form controls for the step setup panels, styled after the design.

const control =
	"w-full h-10 rounded-lg border border-[#E8E8E8] bg-white px-3 text-xs text-[#4A4A4A] outline-none focus:border-[#0091FE]";

export function Field({
	label,
	children,
	className = "",
}: {
	label: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<label className={`flex flex-col gap-1 ${className}`}>
			<span className="text-sm font-medium text-[#4A4A4A]">{label}</span>
			{children}
		</label>
	);
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return <input {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea
			rows={4}
			{...props}
			className={`${control} h-auto py-2.5 resize-none ${props.className ?? ""}`}
		/>
	);
}

export function SelectInput({
	value,
	onChange,
	options,
	placeholder,
}: {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[] | string[];
	placeholder?: string;
}) {
	const opts = options.map((o) =>
		typeof o === "string" ? { value: o, label: o } : o,
	);
	return (
		<span className="relative">
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={`${control} appearance-none pr-9 cursor-pointer ${value ? "" : "text-[#4A4A4A]/80"}`}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{opts.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
			<ChevronDown
				size={16}
				color="#0F172A"
				className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
			/>
		</span>
	);
}

export function PanelTitle({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<h3 className="flex items-center gap-1 text-base font-semibold text-black">
			<span className="h-6 w-6 flex items-center justify-center">{icon}</span>
			{children}
		</h3>
	);
}

export function SaveButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-fit h-8.5 rounded-full bg-[#0091FE] px-6 text-sm font-semibold text-[#F7FAFC] hover:bg-[#0082E6] cursor-pointer"
		>
			Save
		</button>
	);
}
