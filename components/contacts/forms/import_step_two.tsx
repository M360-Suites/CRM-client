import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { useContactStore } from "@/stores/contact/contact_store";

const selectData = [
  {
    name: "First Name",
    value: "firstname",
  },
  {
    name: "Last Name",
    value: "lastname",
  },
  {
    name: "Email",
    value: "email",
  },
  {
    name: "Phone",
    value: "phone",
  },
  {
    name: "Role/Title",
    value: "role",
  },
  {
    name: "Temperature",
    value: "temperature",
  },
];

export default function ImportStepTwo() {
  const { setImportSteps, setCompletedSteps } = useContactStore();
  return (
    <div className="pt-10 flex flex-col gap-12 px-5 relative">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-base text-foreground font-medium">
            First Name
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
            Last Name
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
          <span className="text-base text-foreground font-medium">Email</span>
          <div className="w-125 relative">
            <CustomSelect
              label=""
              placeholder="Select a field"
              selectable={selectData}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-base text-foreground font-medium">Phone</span>
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
            Role/Title
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
            Temperature
          </span>
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
