import Papa from "papaparse";

// A column the bulk-import endpoint recognises. `key` is the exact CSV header
// the backend expects; anything it doesn't recognise lands in custom_fields.
export interface ImportField {
  key: string;
  label: string;
  required?: boolean;
  // Always offered in the mapping dropdown, like required fields
  core?: boolean;
  aliases?: string[];
}

// Mapping targets besides an ImportField key
export const SKIP = "skip";
export const CUSTOM = "custom";

export const COMPANY_IMPORT_FIELDS: ImportField[] = [
  {
    key: "name",
    label: "Company Name",
    required: true,
    aliases: ["company", "company_name", "business_name", "organization"],
  },
  {
    key: "email",
    label: "Email",
    required: true,
    aliases: ["email_address", "emailaddress", "e_mail", "mail"],
  },
  {
    key: "phone",
    label: "Phone",
    required: true,
    aliases: ["phone_number", "mobile", "telephone", "tel"],
  },
  { key: "industry", label: "Industry", aliases: ["sector"] },
  { key: "website", label: "Website", aliases: ["url", "site", "web"] },
  { key: "address", label: "Address", aliases: ["location"] },
  {
    key: "contact_person",
    label: "Contact Person",
    aliases: ["contact", "contact_name"],
  },
  { key: "notes", label: "Notes", aliases: ["note", "comments", "description"] },
];

export const CONTACT_IMPORT_FIELDS: ImportField[] = [
  {
    key: "name",
    label: "Full Name",
    core: true,
    aliases: ["full_name", "contact_name"],
  },
  {
    key: "first_name",
    label: "First Name",
    core: true,
    aliases: ["firstname", "first", "given_name"],
  },
  {
    key: "last_name",
    label: "Last Name",
    core: true,
    aliases: ["lastname", "last", "surname", "family_name"],
  },
  {
    key: "email",
    label: "Email",
    required: true,
    aliases: ["email_address", "emailaddress", "e_mail", "mail"],
  },
  {
    key: "phone",
    label: "Phone",
    required: true,
    aliases: ["phone_number", "mobile", "telephone", "tel"],
  },
  {
    key: "role_title",
    label: "Role / Title",
    aliases: ["role", "title", "job_title", "position"],
  },
  {
    key: "company",
    label: "Company",
    aliases: ["company_name", "organization", "organisation"],
  },
  { key: "temperature", label: "Temperature", aliases: ["temp", "lead_temperature"] },
  { key: "tags", label: "Tags", aliases: ["tag", "labels"] },
];

const normalizeHeader = (header: string) =>
  header
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

// Auto-map each header to a recognised field (each field used at most once).
// Unrecognised headers default to custom so the backend keeps them.
export function guessMapping(headers: string[], fields: ImportField[]) {
  const used = new Set<string>();
  return Object.fromEntries(
    headers.map((header) => {
      const normalized = normalizeHeader(header);
      const match = fields.find(
        (f) =>
          !used.has(f.key) &&
          (f.key === normalized || f.aliases?.includes(normalized)),
      );
      if (match) used.add(match.key);
      return [header, match?.key ?? CUSTOM];
    }),
  );
}

// Each requirement the backend enforces, and whether the mapping satisfies it.
// Contacts accept either a full name or first + last name.
export function checkRequirements(
  mapping: Record<string, string>,
  fields: ImportField[],
) {
  const mapped = new Set(Object.values(mapping));
  const checks = fields
    .filter((f) => f.required)
    .map((f) => ({ label: f.label, met: mapped.has(f.key) }));

  if (fields.some((f) => f.key === "first_name")) {
    checks.unshift({
      label: "Name",
      met:
        mapped.has("name") ||
        (mapped.has("first_name") && mapped.has("last_name")),
    });
  }
  return checks;
}

export interface ImportColumn {
  header: string; // header sent to the backend
  label: string; // header shown in the preview
}

// Only the columns the user chose to import, in file order
export function mappedColumns(
  headers: string[],
  mapping: Record<string, string>,
  fields: ImportField[],
): (ImportColumn & { source: string })[] {
  return headers.flatMap((source) => {
    const target = mapping[source];
    if (!target || target === SKIP) return [];
    if (target === CUSTOM) return [{ source, header: source, label: source }];
    const field = fields.find((f) => f.key === target);
    return field ? [{ source, header: field.key, label: field.label }] : [];
  });
}

// Rebuild the CSV with only the mapped columns, renamed to the backend's keys
export function buildImportFile(
  rows: Record<string, string>[],
  columns: (ImportColumn & { source: string })[],
  originalName: string,
  transform?: (header: string, value: string) => string,
) {
  const data = rows.map((row) =>
    columns.map((c) => {
      const value = (row[c.source] ?? "").trim();
      return transform ? transform(c.header, value) : value;
    }),
  );
  const csv = Papa.unparse({ fields: columns.map((c) => c.header), data });
  return new File([csv], originalName, { type: "text/csv" });
}
