"use client";
import ImportLayout from "../layout/company";
import ImportStepOne from "./forms/import_step_one";
import ImportStepTwo from "./forms/import_step_two";
import ImportStepThree from "./forms/import_step_three";
import ImportDone from "./forms/import_done";
import { useCompanyStore } from "@/stores/company/company_store";

export default function ImportContacts() {
  const { importSteps } = useCompanyStore();
  return (
    <ImportLayout>
      {importSteps === 1 && <ImportStepOne />}
      {importSteps === 2 && <ImportStepTwo />}
      {importSteps === 3 && <ImportStepThree />}
      {importSteps === 4 && <ImportDone />}
    </ImportLayout>
  );
}
