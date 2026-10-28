import { CustomButton } from "@/components/custom/common/customButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  buildImportFile,
  mappedColumns,
  type ImportField,
} from "@/lib/import";

const PREVIEW_LIMIT = 50;

interface ImportPreviewProps {
  file: File | null;
  headers: string[];
  rows: Record<string, string>[];
  mapping: Record<string, string>;
  fields: ImportField[];
  transform?: (header: string, value: string) => string;
  isPending: boolean;
  error?: Error | null;
  onBack: () => void;
  onImport: (file: File) => void;
}

// Import step 3: shows only the columns being imported, then uploads a CSV
// rebuilt with the backend's column names
export function ImportPreview({
  file,
  headers,
  rows,
  mapping,
  fields,
  transform,
  isPending,
  error,
  onBack,
  onImport,
}: ImportPreviewProps) {
  const columns = mappedColumns(headers, mapping, fields);
  const visibleRows = rows.slice(0, PREVIEW_LIMIT);

  return (
    <div className="pt-6 flex flex-col gap-6 px-5">
      <p className="text-sm text-muted-foreground">
        {rows.length > PREVIEW_LIMIT
          ? `Showing the first ${PREVIEW_LIMIT} of ${rows.length} rows.`
          : `${rows.length} rows will be imported.`}
      </p>

      <div className="w-full max-h-[50vh] overflow-auto rounded-[12px] border border-border">
        <Table>
          <TableHeader className="bg-[#FFF6EC] sticky top-0">
            <TableRow>
              {columns.map((c) => (
                <TableHead
                  key={c.source}
                  className="text-left text-xs px-2 whitespace-nowrap"
                >
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((c) => {
                  const value = (row[c.source] ?? "").trim();
                  return (
                    <TableCell
                      key={c.source}
                      className="text-left text-xs text-foreground max-w-48 truncate"
                      title={value}
                    >
                      {transform ? transform(c.header, value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {error && <span className="text-sm text-red-500">{error.message}</span>}

      <div className="flex flex-row items-center gap-4 w-full">
        <CustomButton
          variant="ghost"
          onClick={onBack}
          className="py-4 px-5 flex-1 text-base"
          disabled={isPending}
        >
          Back
        </CustomButton>
        <CustomButton
          className="py-4 px-5 flex-1"
          onClick={() => {
            if (!file) return;
            onImport(buildImportFile(rows, columns, file.name, transform));
          }}
          disabled={isPending || !file}
        >
          {isPending ? "Importing..." : "Import"}
        </CustomButton>
      </div>
    </div>
  );
}
