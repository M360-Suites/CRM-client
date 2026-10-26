"use client";

import React from "react";
import PhoneInput, {
	parsePhoneNumber,
	type Country,
	type Value,
} from "react-phone-number-input/max";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

export const DEFAULT_PHONE_COUNTRY: Country = "NG";

// Older records may hold local numbers like "08012345678"; the picker only
// understands E.164 ("+2348012345678"), so convert what we can and drop the rest.
export const toE164 = (value?: string | null): Value | undefined => {
	if (!value) return undefined;
	try {
		return parsePhoneNumber(value, DEFAULT_PHONE_COUNTRY)?.number;
	} catch {
		return undefined;
	}
};

type CustomPhoneInputProps = {
	label?: string;
	error?: string;
	placeholder?: string;
	value?: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	defaultCountry?: Country;
};

const PhoneTextInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
	<input
		{...props}
		ref={ref}
		className={`outline-none bg-transparent text-base text-foreground max-md:text-sm placeholder:text-sm placeholder:text-foundation-gray-4 focus:ring-0 w-full min-w-0 ${className}`}
	/>
));
PhoneTextInput.displayName = "PhoneTextInput";

export default function CustomPhoneInput({
	label,
	error,
	placeholder = "Enter phone number",
	value,
	onChange,
	onBlur,
	defaultCountry = DEFAULT_PHONE_COUNTRY,
}: CustomPhoneInputProps) {
	return (
		<div className="flex flex-col gap-2 font-inter w-full">
			{label && (
				<label className="text-foreground font-regular text-sm/[110%] max-md:text-xs">
					{label}
				</label>
			)}
			<div
				className={`rounded-[10px] border flex items-center ${error ? "border-foundation-error-6" : "border-[#D9E1E8]"} bg-[#F2F7FB] px-4 py-4.5`}
			>
				<PhoneInput
					flags={flags}
					international
					countryCallingCodeEditable={false}
					limitMaxLength
					defaultCountry={defaultCountry}
					placeholder={placeholder}
					value={toE164(value)}
					onChange={(v) => onChange(v ?? "")}
					onBlur={onBlur}
					inputComponent={PhoneTextInput}
					className="w-full gap-2 [--PhoneInputCountryFlag-height:1.1em] [--PhoneInputCountrySelectArrow-color:#4A4A4A] [--PhoneInputCountrySelectArrow-opacity:0.7]"
				/>
			</div>
		</div>
	);
}
