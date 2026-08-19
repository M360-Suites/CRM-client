import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/commentDialog";

interface CustomModalProps {
  label?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommentModal({
  label,
  trigger,
  children,
  open,
  onOpenChange,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Made Dialog controlled */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="lg:min-w-md lg:min-h-80 flex flex-col gap-0">
        <DialogHeader label={label} className="h-fit" />
        <div className="p-2 h-fit">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
