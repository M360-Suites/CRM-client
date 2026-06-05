import { useState } from "react";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { useCompanyStore } from "@/stores/company/company_store";

const schemaFields = [
  { name: "— Skip —", value: "skip" },
  { name: "Company Name", value: "name" },
  { name: "Industry", value: "industry" },
  { name: "Website", value: "website" },
  { name: "Contact Person", value: "contact_person" },
  { name: "Email", value: "email" },
  { name: "Phone", value: "phone" },
  { name: "Address", value: "address" },
  { name: "Notes", value: "notes" },
];
export default function ImportStepTwo() {
  const { setImportSteps, setCompletedSteps, headers, setMapping } =
    useCompanyStore();

  const [localMapping, setLocalMapping] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      headers.map((header) => {
        const match = schemaFields.find(
          (f) =>
            f.value !== "skip" &&
            f.value === header.toLowerCase().replace(/\s+/g, "_"),
        );
        return [header, match?.value ?? "skip"];
      }),
    ),
  );

  const handlePreview = () => {
    const hasMappedAtLeastOne = Object.values(localMapping).some(
      (v) => v !== "skip",
    );
    if (!hasMappedAtLeastOne) return;

    const confirmedMapping = Object.fromEntries(
      Object.entries(localMapping).filter(([, v]) => v !== "skip"),
    );

    setMapping(confirmedMapping);
    setCompletedSteps([1, 2]);
    setImportSteps(3);
  };

  return (
    <div className="pt-10 flex flex-col gap-12 px-5 relative">
      <div className="flex flex-col gap-4">
        {headers.map((header) => (
          <div
            key={header}
            className="flex flex-row items-center justify-between"
          >
            <span className="text-base text-foreground font-medium">
              {header}
            </span>
            <div className="w-125 relative">
              <CustomSelect
                label=""
                placeholder="Select a field"
                selectable={schemaFields}
                value={localMapping[header]}
                onChange={(value: string) =>
                  setLocalMapping((prev) => ({ ...prev, [header]: value }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center gap-4 w-full">
        <CustomButton
          variant="ghost"
          onClick={() => {
            setImportSteps(1);
            setCompletedSteps([]);
          }}
          className="py-4 px-5 flex-1 text-base"
        >
          Back
        </CustomButton>
        <CustomButton className="py-4 px-5 flex-1" onClick={handlePreview}>
          Preview
        </CustomButton>
      </div>
    </div>
  );
}
