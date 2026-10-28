import { Check, Minus } from "lucide-react";

interface SelectCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}

// Row/card selection checkbox. Stops click propagation so ticking it doesn't
// also open the drawer the row is a trigger for.
export function SelectCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: SelectCheckboxProps) {
  const on = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`h-4.5 w-4.5 shrink-0 rounded-[5px] border flex items-center justify-center cursor-pointer transition-colors ${
        on
          ? "bg-primary border-primary text-white"
          : "bg-white border-[#B8C4CE] hover:border-primary"
      }`}
    >
      {indeterminate ? (
        <Minus size={12} strokeWidth={3} />
      ) : checked ? (
        <Check size={12} strokeWidth={3} />
      ) : null}
    </button>
  );
}
