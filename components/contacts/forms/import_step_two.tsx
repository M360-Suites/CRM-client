import { ImportMapping } from "@/components/custom/common/importMapping";
import { useContactStore } from "@/stores/contact/contact_store";
import { CONTACT_IMPORT_FIELDS } from "@/lib/import";

export default function ImportStepTwo() {
  const { setImportSteps, setCompletedSteps, headers, rows, mapping, setMapping } =
    useContactStore();

  return (
    <ImportMapping
      headers={headers}
      rows={rows}
      fields={CONTACT_IMPORT_FIELDS}
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
