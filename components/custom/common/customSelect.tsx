import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectProps {
  label?: string;
  error?: string;
  placeholder: string;
  selectable: {
    name: string;
    value: string;
  }[];
}

export function CustomSelect({
  label,
  error,
  placeholder,
  selectable,
}: SelectProps) {
  return (
    <div className="w-full flex flex-col gap-3 font-inter">
      {label && (
        <label className="text-foreground font-regular text-base/[120%]">
          {label}
        </label>
      )}
      <Select>
        <SelectTrigger
          className={`w-full rounded-[10px] border flex flex-row justify-between items-center ${error ? "border-foundation-error-6" : "border-border"} bg-[#FFF3E6] px-4 py-7`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" align="center">
          <SelectGroup>
            <SelectLabel>{placeholder}</SelectLabel>
            {selectable.map((value, index) => (
              <SelectGroup key={index}>
                <SelectItem key={value.name} value={value.value}>
                  {value.name}
                </SelectItem>
              </SelectGroup>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
