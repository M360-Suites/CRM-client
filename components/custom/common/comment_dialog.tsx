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

export function CommentModal({ label, trigger, children }: CustomModalProps) {
  return (
    <Dialog>
      {/* Made Dialog controlled */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader label={label} />
        <div className="p-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
