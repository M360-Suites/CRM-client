import { Check } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";

export default function ImportDone() {
  return (
    <div className="flex flex-col gap-6 w-full pt-8 px-7">
      <div className="bg-[#FFF6EC] h-40 rounded-[10px] flex flex-col items-center justify-center gap-2">
        <Check size={36} color="#E2725B" className="mx-auto" />
        <span className="text-foreground text-sm font-normal block text-center">
          Your companies have been successfully imported!
        </span>
      </div>
      <div className="px-10">
        <CustomButton className="w-full flex flex-row items-center py-3">
          Done
        </CustomButton>
      </div>
    </div>
  );
}
