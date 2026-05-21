import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { useCompanyStore } from "@/stores/company/company_store";

const selectData = [
  {
    name: "Company Name",
    value: "company name",
  },
  {
    name: "Industry",
    value: "industry",
  },
  {
    name: "Website",
    value: "website",
  },
  {
    name: "Notes",
    value: "notes",
  },
];

export default function ImportStepTwo() {
  const { setImportSteps, setCompletedSteps } = useCompanyStore();
  return (
    <div className="pt-10 flex flex-col gap-12 px-5 relative">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-base text-foreground font-medium">
            Company Name
          </span>
          <div className="w-125 relative">
            <CustomSelect
              label=""
              placeholder="Select a field"
              selectable={selectData}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-base text-foreground font-medium">
            Industry
          </span>
          <div className="w-125 relative">
            <CustomSelect
              label=""
              placeholder="Select a field"
              selectable={selectData}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-base text-foreground font-medium">Website</span>
          <div className="w-125 relative">
            <CustomSelect
              label=""
              placeholder="Select a field"
              selectable={selectData}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-base text-foreground font-medium">Notes</span>
          <div className="w-125 relative">
            <CustomSelect
              label=""
              placeholder="Select a field"
              selectable={selectData}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <CustomButton
          variant={"ghost"}
          onClick={() => {
            setImportSteps(1);
            setCompletedSteps([1, 2]);
          }}
          className="py-4 px-5 flex-1 text-base"
        >
          Back
        </CustomButton>
        <CustomButton
          className="py-4 px-5 flex-1"
          onClick={() => {
            setImportSteps(3);
            setCompletedSteps([2]);
          }}
        >
          Preview
        </CustomButton>
      </div>
    </div>
  );
}
