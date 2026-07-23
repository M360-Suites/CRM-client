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
  value?: string;
  onChange?: (value: string) => void;
}

export function CustomSelect({
  label,
  error,
  placeholder,
  selectable,
  value,
  onChange,
}: SelectProps) {
  return (
    <div className="w-full flex flex-col gap-3 font-inter">
      {label && (
        <label className="text-foreground font-regular max-md:text-xs text-base/[120%]">
          {label}
        </label>
      )}
      {/* Controlled Select: value is a string, onChange receives the selected string */}
      <Select value={value} onValueChange={(v: string) => onChange?.(v)}>
        <SelectTrigger
          className={`w-full rounded-[10px] border flex flex-row justify-between items-center ${
            error ? "border-foundation-error-6" : "border-border"
          } bg-[#FFF3E6] px-4 py-7`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" align="center">
          <SelectGroup>
            <SelectLabel className="max-md:text-sm">{placeholder}</SelectLabel>
            {selectable.length === 0 ? (
              <div className="py-3 font-inter px-2 text-sm text-muted-foreground text-center">
                {`No ${label ?? "options"} available`}
              </div>
            ) : (
              selectable.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="py-3 max-md:text-sm"
                >
                  {opt.name}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
