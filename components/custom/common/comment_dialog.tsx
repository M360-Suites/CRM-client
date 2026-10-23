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
      <DialogContent
        className="lg:min-w-md lg:min-h-80 flex flex-col gap-0"
        onEscapeKeyDown={(event) => {
          // Escape closes an open @mention list, not the dialog
          if (
            (event.target as HTMLElement | null)?.closest?.(
              '[data-mention-open="true"]',
            )
          )
            event.preventDefault();
        }}
      >
        <DialogHeader label={label} className="h-fit" />
        <div className="p-2 h-fit">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
