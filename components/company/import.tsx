"use client";
import ImportLayout from "../layout/company";
import ImportStepOne from "./forms/import_step_one";
import ImportStepTwo from "./forms/import_step_two";
import ImportStepThree from "./forms/import_step_three";
import ImportDone from "./forms/import_done";
import { useCompanyStore } from "@/stores/company/company_store";

interface ImportCompanyProps {
  onSuccess?: () => void;
}

export default function ImportCompanies({ onSuccess }: ImportCompanyProps) {
  const { importSteps, resetImport } = useCompanyStore();
  return (
    <ImportLayout>
      {importSteps === 1 && <ImportStepOne />}
      {importSteps === 2 && <ImportStepTwo />}
      {importSteps === 3 && <ImportStepThree />}
      {importSteps === 4 && (
        <ImportDone
          onSuccess={() => {
            onSuccess?.(); // call close() first
            resetImport(); // then reset
          }}
        />
      )}
    </ImportLayout>
  );
}
