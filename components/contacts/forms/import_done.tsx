import { Check } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";

interface DoneProps {
  onSuccess: () => void;
}

export default function ImportDone({ onSuccess }: DoneProps) {
  return (
    <div className="flex flex-col gap-10 w-full px-8 pt-8">
      <div className="bg-[#FFF6EC] h-40 rounded-[10px] flex flex-col items-center justify-center gap-2">
        <Check size={36} color="#E2725B" className="mx-auto" />
        <span className="text-foreground text-sm font-normal block text-center">
          Your contacts have been successfully imported!
        </span>
      </div>
      <div className="px-10">
        <CustomButton
          className="w-full flex flex-row items-center py-3"
          onClick={onSuccess}
        >
          Done
        </CustomButton>
      </div>
    </div>
  );
}
