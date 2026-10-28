import { useMemo, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomButton } from "@/components/custom/common/customButton";
import {
  CUSTOM,
  SKIP,
  checkRequirements,
  guessMapping,
  type ImportField,
} from "@/lib/import";

interface ImportMappingProps {
  headers: string[];
  rows: Record<string, string>[];
  fields: ImportField[];
  // Mapping confirmed earlier, restored when coming back from the preview
  savedMapping?: Record<string, string>;
  onBack: () => void;
  onConfirm: (mapping: Record<string, string>) => void;
}

// Import step 2: one row per CSV header with a sample value and the field it
// imports as. Only required fields and fields detected in the file are offered.
export function ImportMapping({
  headers,
  rows,
  fields,
  savedMapping,
  onBack,
  onConfirm,
}: ImportMappingProps) {
  const initial = useMemo(() => guessMapping(headers, fields), [headers, fields]);
  const [mapping, setMapping] = useState<Record<string, string>>(() =>
    savedMapping && Object.keys(savedMapping).length ? savedMapping : initial,
  );

  const options = useMemo(() => {
    const detected = new Set(Object.values(initial));
    return fields.filter((f) => f.required || f.core || detected.has(f.key));
  }, [fields, initial]);

  const requirements = checkRequirements(mapping, fields);
  const missing = requirements.filter((r) => !r.met).map((r) => r.label);
  const importedCount = Object.values(mapping).filter((v) => v !== SKIP).length;

  const sampleFor = (header: string) =>
    rows.find((r) => r[header]?.trim())?.[header]?.trim() ?? "";

  return (
    <div className="pt-6 flex flex-col gap-6 px-5">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          {headers.length} columns and {rows.length} rows found. Choose how each
          column should be imported.
        </p>
        <div className="flex flex-wrap gap-2">
          {requirements.map(({ label, met }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                met ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
            >
              {met ? <Check size={12} /> : <X size={12} />}
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[12px] border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_16px_14rem] gap-4 bg-[#F2F7FB] px-4 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Column in your file</span>
          <span />
          <span>Import as</span>
        </div>
        <ul className="divide-y divide-border max-h-[50vh] overflow-y-auto">
          {headers.map((header) => {
            const value = mapping[header];
            const sample = sampleFor(header);
            const skipped = value === SKIP;
            return (
              <li
                key={header}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_16px_14rem] items-center gap-4 px-4 py-3"
              >
                <div className={`min-w-0 ${skipped ? "opacity-50" : ""}`}>
                  <p
                    className="truncate text-sm font-medium text-foreground"
                    title={header}
                  >
                    {header}
                  </p>
                  <p
                    className="truncate text-xs text-muted-foreground"
                    title={sample}
                  >
                    {sample ? `e.g. ${sample}` : "No values"}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="hidden md:block text-muted-foreground"
                />
                <Select
                  value={value}
                  onValueChange={(v: string) =>
                    setMapping((prev) => ({ ...prev, [header]: v }))
                  }
                >
                  <SelectTrigger className="w-56 max-md:w-40 rounded-[10px] border border-[#D9E1E8] bg-[#F2F7FB] px-3 data-[size=default]:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" align="end">
                    <SelectGroup>
                      <SelectLabel>Fields</SelectLabel>
                      {options.map((f) => {
                        const takenBy = Object.entries(mapping).find(
                          ([h, v]) => v === f.key && h !== header,
                        );
                        return (
                          <SelectItem
                            key={f.key}
                            value={f.key}
                            disabled={!!takenBy}
                            className="py-2"
                          >
                            {f.label}
                            {f.required && " *"}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectItem value={CUSTOM} className="py-2">
                        Custom field
                      </SelectItem>
                      <SelectItem value={SKIP} className="py-2">
                        Don&apos;t import
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </li>
            );
          })}
        </ul>
      </div>

      {missing.length > 0 && (
        <p className="text-sm text-red-500">
          Map a column to {missing.join(", ")} to continue.
        </p>
      )}

      <div className="flex flex-row items-center gap-4 w-full">
        <CustomButton
          variant="ghost"
          onClick={onBack}
          className="py-4 px-5 flex-1 text-base"
        >
          Back
        </CustomButton>
        <CustomButton
          className="py-4 px-5 flex-1"
          onClick={() => onConfirm(mapping)}
          disabled={missing.length > 0 || importedCount === 0}
        >
          Preview
        </CustomButton>
      </div>
    </div>
  );
}
