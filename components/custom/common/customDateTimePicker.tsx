"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronUp, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toUTC(date: Date, hr: number, min: number, ampm: "AM" | "PM"): string {
  let hours = hr % 12;
  if (ampm === "PM") hours += 12;
  const local = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    min,
    0,
    0,
  );
  return local.toISOString();
}

function formatDisplay(
  date: Date,
  hr: number,
  min: number,
  ampm: "AM" | "PM",
): string {
  return `${format(date, "MMM d, yyyy")}  •  ${pad(hr)}:${pad(min)} ${ampm}`;
}

// ── Inner picker (uncontrolled / standalone) ─────────────────
interface DateTimePickerProps {
  label: string;
  error?: string;
  placeholder?: string;
  value?: string | null;
  onChange?: (utc: string) => void;
  onBlur?: () => void;
}

export function CustomDateTimePicker({
  label,
  error,
  placeholder = "Select date & time",
  value,
  onChange,
  onBlur,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hr, setHr] = useState(12);
  const [min, setMin] = useState(0);
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const ref = useRef<HTMLDivElement>(null);

  // Sync from external UTC value
  useEffect(() => {
    if (!value) return;
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    let h = d.getHours();
    const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    setHr(h);
    setMin(d.getMinutes());
    setAmpm(period);
  }, [value]);

  // Close on outside click + trigger onBlur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onBlur]);

  const handleConfirm = () => {
    if (!date) return;
    onChange?.(toUTC(date, hr, min, ampm));
    setOpen(false);
    onBlur?.();
  };

  const displayValue = (() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        let h = d.getHours();
        const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return formatDisplay(
          new Date(d.getFullYear(), d.getMonth(), d.getDate()),
          h,
          d.getMinutes(),
          period,
        );
      }
    }
    return null;
  })();

  const spinnerBtn =
    "flex items-center justify-center w-8 h-6 rounded-md border border-border hover:bg-[#FFD9C0] text-foundation-gray-4 transition-colors cursor-pointer";

  const spinnerVal =
    "w-11 text-center text-xl font-medium text-foreground bg-[#FFF3E6] border border-border rounded-[8px] py-1.5 select-none";

  return (
    <div className="flex flex-col gap-2 font-inter w-full relative" ref={ref}>
      <label className="text-foreground font-regular text-sm/[120%]">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`rounded-[10px] border flex flex-row justify-between items-center px-4 py-4.5 bg-[#FFF3E6] w-full text-left ${
          error ? "border-foundation-error-6" : "border-border"
        }`}
      >
        <span
          className={`text-base ${
            displayValue ? "text-foreground" : "text-sm text-gray-500"
          }`}
        >
          {displayValue || placeholder}
        </span>
        <CalendarIcon size={20} color="#777777" />
      </button>

      {error && <p className="text-foundation-error-6 text-sm">{error}</p>}

      {open && (
        <div className="absolute top-full mt-1 z-50 bg-background border border-border rounded-[10px] shadow-sm overflow-hidden w-fit max-md:w-full">
          <div className="flex items-start divide-x divide-border">
            {/* Left — Calendar */}
            <div className="p-2 max-md:p-1">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </div>

            {/* Right — Time */}
            <div className="flex flex-col justify-between md:p-4 p-2 w-42">
              <div>
                <p className="text-xs text-foundation-gray-4 mb-4 text-center">
                  Select time
                </p>

                <div className="flex items-center max-md:gap-4 max-md:flex-col justify-center gap-2">
                  {/* Hours */}
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        className={spinnerBtn}
                        onClick={() => setHr((h) => (h % 12) + 1)}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <div className={spinnerVal}>{pad(hr)}</div>
                      <button
                        type="button"
                        className={spinnerBtn}
                        onClick={() => setHr((h) => ((h - 2 + 12) % 12) + 1)}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    <span className="text-2xl font-medium text-foundation-gray-4">
                      :
                    </span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        className={spinnerBtn}
                        onClick={() => setMin((m) => (m + 5) % 60)}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <div className={spinnerVal}>{pad(min)}</div>
                      <button
                        type="button"
                        className={spinnerBtn}
                        onClick={() => setMin((m) => (m - 5 + 60) % 60)}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>

                  {/* AM/PM */}
                  <div className="flex flex-col max-md:flex-row max-md:gap-3 gap-1.5">
                    {(["AM", "PM"] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setAmpm(period)}
                        className={`px-2 py-1.5 text-sm font-medium rounded-[8px] border transition-colors cursor-pointer ${
                          ampm === period
                            ? "bg-[#C95C47] text-white border-[#C95C47]"
                            : "bg-[#FFF3E6] text-foreground border-border hover:bg-[#FFD9C0]"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!date}
                onClick={handleConfirm}
                className="mt-5 w-full bg-[#C95C47] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-[8px] py-2 text-sm font-medium hover:bg-[#b04f3c] transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Controller wrapper ───────────────────────────────────────
interface ControlledDateTimePickerProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label: string;
  placeholder?: string;
}

export function ControlledDateTimePicker<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
}: ControlledDateTimePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <CustomDateTimePicker
          label={label}
          placeholder={placeholder}
          value={field.value ?? null}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
