import { CustomButton } from "@/components/custom/common/customButton";
import { useContactStore } from "@/stores/contact/contact_store";
import { useContactBulkImport } from "@/hooks/contact/bulk_import";
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
  company: string;
}

function applyMapping(
  rows: Record<string, string>[],
  mapping: Record<string, string>,
): MappedContact[] {
  return rows.map((row) => {
    const mapped: Record<string, string> = {};
    for (const [csvHeader, schemaField] of Object.entries(mapping)) {
      mapped[schemaField] = row[csvHeader] ?? "";
    }
    return {
      first_name: mapped.first_name ?? "",
      last_name: mapped.last_name ?? "",
      email: mapped.email ?? "",
      phone: mapped.phone ?? "",
      role: mapped.role ?? "",
      temperature: mapped.temperature ?? "",
      company: mapped.company ?? "",
    };
  });
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
              <TableHead className="text-left text-xs px-2">Company</TableHead>
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
                  {contact.company}
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
            bulkImport(file);
          }}
          disabled={isPending || !file}
        >
          {isPending ? "Importing..." : "Import"}
        </CustomButton>
      </div>
    </div>
  );
}
