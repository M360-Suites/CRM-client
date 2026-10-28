// "deal_title" / "Deal Title" -> "Deal title"
const formatKey = (key: string) => {
  const spaced = key.replace(/[_-]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
};

const formatValue = (value: unknown) => {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value);
};

// Key-value list of the extra columns the backend stored in custom_fields
// (e.g. unrecognised CSV columns from a bulk import). Renders nothing if empty.
export function CustomFields({
  fields,
  className = "",
}: {
  fields?: Record<string, unknown> | null;
  className?: string;
}) {
  const entries = Object.entries(fields ?? {}).filter(
    ([, v]) => v !== null && v !== undefined && String(v).trim() !== "",
  );
  if (entries.length === 0) return null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-base font-medium text-foreground">
        Additional info
      </span>
      <dl className="flex flex-col">
        {entries.map(([key, value]) => (
          <div key={key} className="py-2 flex justify-between gap-6 w-full">
            <dt className="text-sm text-foreground shrink-0">
              {formatKey(key)}
            </dt>
            <dd className="text-sm text-foreground/70 text-right break-words min-w-0">
              {formatValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
