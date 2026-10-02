import { CustomButton } from "@/components/custom/common/customButton";
import { useContactStore } from "@/stores/contact/contact_store";
import { useContactBulkImport } from "@/hooks/contact/bulk_import";
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MappedContact {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  temperature: string;
  source: string;
  date: string;
}

// "Jane Mary Smith" -> first: "Jane", last: "Mary Smith"
function splitFullName(fullName: string) {
  const [first = "", ...rest] = fullName.trim().split(/\s+/);
  return { first_name: first, last_name: rest.join(" ") };
}

const pad = (n: number) => String(n).padStart(2, "0");

// Normalize to YYYY-MM-DD. Slash/dash dates are read as DD/MM/YYYY unless the
// second part is > 12 (then MM/DD/YYYY). Unparseable values are kept as-is.
function normalizeDate(value: string) {
  if (!value) return "";
  const dmy = value.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (dmy) {
    let [a, b] = [Number(dmy[1]), Number(dmy[2])];
    const year = dmy[3].length === 2 ? 2000 + Number(dmy[3]) : Number(dmy[3]);
    if (b > 12) [a, b] = [b, a];
    const date = new Date(year, b - 1, a);
    if (date.getMonth() !== b - 1) return value;
    return `${year}-${pad(b)}-${pad(a)}`;
  }
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) return value;
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

function applyMapping(
  rows: Record<string, string>[],
  mapping: Record<string, string>,
): MappedContact[] {
  return rows.map((row) => {
    const mapped: Record<string, string> = {};
    for (const [csvHeader, schemaField] of Object.entries(mapping)) {
      mapped[schemaField] = (row[csvHeader] ?? "").trim();
    }
    const fromFullName = splitFullName(mapped.full_name ?? "");
    return {
      first_name: mapped.first_name || fromFullName.first_name,
      last_name: mapped.last_name || fromFullName.last_name,
      email: mapped.email ?? "",
      phone: mapped.phone ?? "",
      role: mapped.role ?? "",
      temperature: mapped.temperature ?? "",
      source: mapped.source ?? "",
      date: normalizeDate(mapped.date ?? ""),
    };
  });
}

// Rebuild the upload with our canonical headers so the backend receives the
// user's mapping instead of the client's original column names
function toNormalizedCsvFile(contacts: MappedContact[], originalName: string) {
  const csv = Papa.unparse(contacts);
  const name = originalName.replace(/\.(xlsx|xls)$/i, ".csv");
  return new File([csv], name, { type: "text/csv" });
}

export default function ImportStepThree() {
  const { setImportSteps, setCompletedSteps, file, rows, mapping } =
    useContactStore();
  const { mutate: bulkImport, isPending, error } = useContactBulkImport();

  const preview = applyMapping(rows, mapping);

  return (
    <div className="pt-10 flex flex-col gap-12 px-5 relative">
      <div className="w-full">
        <Table>
          <TableHeader className="bg-[#FFF6EC]">
            <TableRow>
              <TableHead className="text-left text-xs px-2">
                First Name
              </TableHead>
              <TableHead className="text-left text-xs px-2">
                Last Name
              </TableHead>
              <TableHead className="text-left text-xs px-2">Email</TableHead>
              <TableHead className="text-left text-xs px-2">Phone</TableHead>
              <TableHead className="text-left text-xs px-2">
                Role / Title
              </TableHead>
              <TableHead className="text-left text-xs px-2">
                Temperature
              </TableHead>
              <TableHead className="text-left text-xs px-2">Source</TableHead>
              <TableHead className="text-left text-xs px-2">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.map((contact, index) => (
              <TableRow key={index}>
                <TableCell className="font-normal text-xs text-left">
                  {contact.first_name}
                </TableCell>
                <TableCell className="text-left text-xs text-foreground">
                  {contact.last_name}
                </TableCell>
                <TableCell className="text-left text-xs text-foreground">
                  {contact.email}
                </TableCell>
                <TableCell className="text-left text-xs text-foreground">
                  {contact.phone}
                </TableCell>
                <TableCell className="text-left text-xs text-foreground">
                  {contact.role}
                </TableCell>
                <TableCell className="text-left text-xs text-foreground">
                  {contact.temperature}
                </TableCell>
                <TableCell className="text-left text-xs text-foreground">
                  {contact.source}
                </TableCell>
                <TableCell className="text-left text-xs text-foreground">
                  {contact.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {error && <span className="text-sm text-red-500">{error.message}</span>}

      <div className="flex flex-row items-center gap-4 w-full">
        <CustomButton
          variant="ghost"
          onClick={() => {
            setImportSteps(2);
            setCompletedSteps([1]);
          }}
          className="py-4 px-5 flex-1 text-base"
          disabled={isPending}
        >
          Back
        </CustomButton>
        <CustomButton
          className="py-4 px-5 flex-1"
          onClick={() => {
            if (!file) return;
            bulkImport(toNormalizedCsvFile(preview, file.name));
          }}
          disabled={isPending || !file}
        >
          {isPending ? "Importing..." : "Import"}
        </CustomButton>
      </div>
    </div>
  );
}
