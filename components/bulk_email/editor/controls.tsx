"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Small form controls shared by the template and broadcast inspectors.

const HEX = /^[0-9a-fA-F]{0,6}$/;

export function ColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (hex: string) => void;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-[11px] text-[#64748B]">{label}</span>
			<div className="flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1.5">
				<label
					className="relative h-4 w-4 shrink-0 rounded-full border border-[#E2E8F0] cursor-pointer overflow-hidden"
					style={{ backgroundColor: `#${value}` }}
				>
					<input
						type="color"
						aria-label={`${label} picker`}
						value={`#${value.padEnd(6, "0")}`}
						onChange={(e) =>
							onChange(e.target.value.slice(1).toUpperCase())
						}
						className="absolute inset-0 opacity-0 cursor-pointer"
					/>
				</label>
				<span className="text-xs text-[#94A3B8]">#</span>
				<input
					aria-label={label}
					value={value}
					maxLength={6}
					onChange={(e) =>
						HEX.test(e.target.value) &&
						onChange(e.target.value.toUpperCase())
					}
					className="flex-1 min-w-0 font-mono text-[11px] text-[#0F172A] outline-none bg-transparent"
				/>
			</div>
		</div>
	);
}

export function Segmented<T extends string>({
	label,
	value,
	options,
	onChange,
}: {
	label?: string;
	value: T;
	options: { value: T; label: React.ReactNode; title?: string }[];
	onChange: (value: T) => void;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			{label && <span className="text-xs text-[#334155]">{label}</span>}
			<div className="flex rounded-md bg-[#F1F5F9] p-0.5">
				{options.map((o) => (
					<button
						key={o.value}
						type="button"
						title={o.title}
						aria-pressed={o.value === value}
						onClick={() => onChange(o.value)}
						className={`flex-1 flex items-center justify-center rounded-[5px] py-1 text-xs cursor-pointer ${
							o.value === value
								? "bg-white font-medium text-[#0F172A] shadow-sm"
								: "text-[#64748B] hover:text-[#0F172A]"
						}`}
					>
						{o.label}
					</button>
				))}
			</div>
		</div>
	);
}

export function Toggle({
	label,
	checked,
	onChange,
	hint,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	hint?: string;
}) {
	return (
		<div className="flex flex-col gap-0.5">
			<label className="flex items-center justify-between gap-2 cursor-pointer">
				<span className="text-xs text-[#334155]">{label}</span>
				<button
					type="button"
					role="switch"
					aria-checked={checked}
					onClick={() => onChange(!checked)}
					className={`relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer ${
						checked ? "bg-[#0091FE]" : "bg-[#CBD5E1]"
					}`}
				>
					<span
						className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
							checked ? "left-4.5" : "left-0.5"
						}`}
					/>
				</button>
			</label>
			{hint && <span className="text-[10px] text-[#94A3B8]">{hint}</span>}
		</div>
	);
}

export function Slider({
	label,
	value,
	min,
	max,
	unit,
	onChange,
}: {
	label?: string;
	value: number;
	min: number;
	max: number;
	unit: string;
	onChange: (value: number) => void;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			{label && <span className="text-xs text-[#334155]">{label}</span>}
			<div className="flex items-center gap-3">
				<input
					type="range"
					aria-label={label}
					min={min}
					max={max}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					className="flex-1 accent-[#0091FE] cursor-pointer"
				/>
				<div className="flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-0.5 text-xs">
					<input
						aria-label={`${label ?? "Value"} in ${unit}`}
						value={value}
						onChange={(e) => {
							const n = Number(e.target.value);
							if (!Number.isNaN(n))
								onChange(Math.min(max, Math.max(min, n)));
						}}
						className="w-8 text-right font-mono outline-none bg-transparent"
					/>
					<span className="text-[#94A3B8]">{unit}</span>
				</div>
			</div>
		</div>
	);
}

export function TextField({
	label,
	value,
	placeholder,
	icon,
	onChange,
}: {
	label: string;
	value: string;
	placeholder?: string;
	icon?: React.ReactNode;
	onChange: (value: string) => void;
}) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-xs text-[#334155]">{label}</span>
			<span className="flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1.5 focus-within:border-[#0091FE]">
				<input
					value={value}
					placeholder={placeholder}
					onChange={(e) => onChange(e.target.value)}
					className="flex-1 min-w-0 text-xs text-[#0F172A] outline-none bg-transparent placeholder:text-[#CBD5E1]"
				/>
				{icon}
			</span>
		</label>
	);
}

export function Accordion({
	title,
	defaultOpen = true,
	children,
}: {
	title: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="flex flex-col gap-3 border-t border-[#F1F5F9] pt-4">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				className="flex items-center justify-between text-xs font-medium text-[#0F172A] cursor-pointer"
			>
				{title}
				<ChevronDown
					size={14}
					className={`transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>
			{open && <div className="flex flex-col gap-3">{children}</div>}
		</div>
	);
}
