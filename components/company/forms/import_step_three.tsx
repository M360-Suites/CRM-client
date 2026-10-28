import { ImportPreview } from "@/components/custom/common/importPreview";
import { useCompanyStore } from "@/stores/company/company_store";
import { useCompanyBulkImport } from "@/hooks/company/bulk_import";
import { COMPANY_IMPORT_FIELDS } from "@/lib/import";

export default function ImportStepThree() {
  const { setImportSteps, setCompletedSteps, file, headers, rows, mapping } =
    useCompanyStore();
  const { mutate: bulkImport, isPending, error } = useCompanyBulkImport();

  return (
    <ImportPreview
      file={file}
      headers={headers}
      rows={rows}
      mapping={mapping}
      fields={COMPANY_IMPORT_FIELDS}
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
