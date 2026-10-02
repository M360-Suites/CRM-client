import { useState } from "react";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { useContactStore } from "@/stores/contact/contact_store";

const schemaFields = [
  { name: "— Skip —", value: "skip" },
  { name: "Full Name (split into first/last)", value: "full_name" },
  { name: "First Name", value: "first_name" },
  { name: "Last Name", value: "last_name" },
  { name: "Email", value: "email" },
  { name: "Phone", value: "phone" },
  { name: "Role / Title", value: "role" },
  { name: "Temperature", value: "temperature" },
  { name: "Source", value: "source" },
  { name: "Date", value: "date" },
];

// Common header variations clients use, normalized to schema field values
const headerAliases: Record<string, string> = {
  name: "full_name",
  full_name: "full_name",
  contact_name: "full_name",
  firstname: "first_name",
  lastname: "last_name",
  surname: "last_name",
  email_address: "email",
  emailaddress: "email",
  e_mail: "email",
  e_mail_address: "email",
  mail: "email",
  phone_number: "phone",
  mobile: "phone",
  title: "role",
  role_title: "role",
  job_title: "role",
  lead_source: "source",
  date_added: "date",
  date_created: "date",
  created_at: "date",
  created: "date",
  created_date: "date",
};

const guessField = (header: string) => {
  const normalized = header.trim().toLowerCase().replace(/[\s-]+/g, "_").replace(/[^a-z0-9_]/g, "");
  if (schemaFields.some((f) => f.value !== "skip" && f.value === normalized))
    return normalized;
  return headerAliases[normalized] ?? "skip";
};

export default function ImportStepTwo() {
  const { setImportSteps, setCompletedSteps, headers, setMapping } =
    useContactStore();

  const [localMapping, setLocalMapping] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      headers.map((header) => [header, guessField(header)]),
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
