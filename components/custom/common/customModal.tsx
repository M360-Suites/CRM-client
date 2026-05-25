import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomButton } from "../common/customButton";

interface CustomModalProps {
  label?: string;
  buttonLabel: string;
  type: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean; // Added open prop for controlled behavior
  onOpenChange?: (open: boolean) => void;
}

export function CustomModal({
  label,
  trigger,
  children,
  type,
  buttonLabel,
}: CustomModalProps) {
  const isDelete = type === "delete";
  return (
    <Dialog>
      {/* Made Dialog controlled */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader label={label} />
        <div className="px-6 pt-4 pb-6">{children}</div>
        <DialogFooter>
          {isDelete && (
            <CustomButton
              variant="outline"
              onClick={() => console.log("Cancel")}
            >
              Cancel
            </CustomButton>
          )}
          <CustomButton
            onClick={() => console.log("Save category")}
            className="text-sm"
          >
            {buttonLabel}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
