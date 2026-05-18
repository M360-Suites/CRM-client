"use client";
import ImportLayout from "../layout/import";
import { useContactStore } from "@/stores/contact/contact_store";
import ImportStepOne from "./forms/import_step_one";
import ImportStepTwo from "./forms/import_step_two";
import ImportStepThree from "./forms/import_step_three";
import ImportDone from "./forms/import_done";

export default function ImportContacts() {
  const { importSteps } = useContactStore();
  return (
    <ImportLayout>
      {importSteps === 1 && <ImportStepOne />}
      {importSteps === 2 && <ImportStepTwo />}
      {importSteps === 3 && <ImportStepThree />}
      {importSteps === 4 && <ImportDone />}
    </ImportLayout>
  );
}
