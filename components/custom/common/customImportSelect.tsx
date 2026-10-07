import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface ImportSelectProps {
	label: string;
	placeholder: string;
	selectable: {
		name: string;
		value: string;
	}[];
	value?: string;
	onChange?: (value: string) => void;
}

// Compact select for mapping CSV headers to fields in import step 2:
// the CSV header sits on the left, the select on the right with a gap between
export function CustomImportSelect({
	label,
	placeholder,
	selectable,
	value,
	onChange,
}: ImportSelectProps) {
	return (
		<div className="flex flex-row items-center justify-between gap-8 w-full font-inter">
			<span
				className="flex-1 min-w-0 truncate text-base text-foreground font-medium"
				title={label}
			>
				{label}
			</span>
			<Select value={value} onValueChange={(v: string) => onChange?.(v)}>
				<SelectTrigger className="w-125 max-md:w-1/2 shrink-0 rounded-[10px] border border-[#D9E1E8] bg-[#F2F7FB] px-4 py-2 data-[size=default]:h-11 text-sm">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position="popper" align="center">
					<SelectGroup>
						{selectable.map((opt) => (
							<SelectItem
								key={opt.value}
								value={opt.value}
								className="py-2 max-md:text-sm"
							>
								{opt.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
