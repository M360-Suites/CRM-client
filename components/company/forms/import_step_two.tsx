import { ImportMapping } from "@/components/custom/common/importMapping";
import { useCompanyStore } from "@/stores/company/company_store";
import { COMPANY_IMPORT_FIELDS } from "@/lib/import";

export default function ImportStepTwo() {
  const { setImportSteps, setCompletedSteps, headers, rows, mapping, setMapping } =
    useCompanyStore();

  return (
    <ImportMapping
      headers={headers}
      rows={rows}
      fields={COMPANY_IMPORT_FIELDS}
      savedMapping={mapping}
      onBack={() => {
        setImportSteps(1);
        setCompletedSteps([]);
      }}
      onConfirm={(confirmed) => {
        setMapping(confirmed);
        setCompletedSteps([1, 2]);
        setImportSteps(3);
      }}
    />
  );
}
