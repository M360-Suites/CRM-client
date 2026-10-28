import { ImportPreview } from "@/components/custom/common/importPreview";
import { useContactStore } from "@/stores/contact/contact_store";
import { useContactBulkImport } from "@/hooks/contact/bulk_import";
import { CONTACT_IMPORT_FIELDS } from "@/lib/import";

// The backend only accepts lowercase hot/warm/cold
const normalizeValue = (header: string, value: string) =>
  header === "temperature" ? value.toLowerCase() : value;

export default function ImportStepThree() {
  const { setImportSteps, setCompletedSteps, file, headers, rows, mapping } =
    useContactStore();
  const { mutate: bulkImport, isPending, error } = useContactBulkImport();

  return (
    <ImportPreview
      file={file}
      headers={headers}
      rows={rows}
      mapping={mapping}
      fields={CONTACT_IMPORT_FIELDS}
      transform={normalizeValue}
      isPending={isPending}
      error={error}
      onBack={() => {
        setImportSteps(2);
        setCompletedSteps([1]);
      }}
      onImport={bulkImport}
    />
  );
}
