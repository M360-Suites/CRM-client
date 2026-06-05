import { CustomButton } from "@/components/custom/common/customButton";
import { useCompanyStore } from "@/stores/company/company_store";
import { useCompanyBulkImport } from "@/hooks/company/bulk_import";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MappedCompany {
  name: string;
  industry: string;
  website: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

function applyMapping(
  rows: Record<string, string>[],
  mapping: Record<string, string>,
): MappedCompany[] {
  return rows.map((row) => {
    const mapped: Record<string, string> = {};
    for (const [csvHeader, schemaField] of Object.entries(mapping)) {
      mapped[schemaField] = row[csvHeader] ?? "";
    }
    return {
      name: mapped.name ?? "",
      industry: mapped.industry ?? "",
      website: mapped.website ?? "",
      contact_person: mapped.contact_person ?? "",
      email: mapped.email ?? "",
      phone: mapped.phone ?? "",
      address: mapped.address ?? "",
      notes: mapped.notes ?? "",
    };
  });
}

export default function ImportStepThree() {
  const { setImportSteps, setCompletedSteps, file, rows, mapping } =
    useCompanyStore();
  const { mutate: bulkImport, isPending, error } = useCompanyBulkImport();

  const preview = applyMapping(rows, mapping);

  return (
    <div className="pt-10 flex flex-col gap-12 px-5 relative">
      <div className="w-full">
        <Table>
          <TableHeader className="bg-[#FFF6EC]">
            <TableRow>
              <TableHead className="text-left text-xs px-2">
                Company Name
              </TableHead>
              <TableHead className="text-left text-xs px-2">Industry</TableHead>
              <TableHead className="text-left text-xs px-2">Website</TableHead>
              <TableHead className="text-left text-xs px-2">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.map((company, index) => (
              <TableRow key={index}>
                <TableCell className="text-left text-xs">
                  {company.name}
                </TableCell>
                <TableCell className="text-left text-xs">
                  {company.industry}
                </TableCell>
                <TableCell className="text-left text-xs">
                  {company.website}
                </TableCell>
                <TableCell className="text-left text-xs">
                  {company.notes}
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
