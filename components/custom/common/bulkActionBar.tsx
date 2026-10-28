import { Trash2, X } from "lucide-react";
import { CustomButton } from "./customButton";
import { ConfirmRevokeModal } from "./confirm_revoke_modal";

interface BulkActionBarProps {
  count: number;
  // Singular / plural noun, e.g. ["contact", "contacts"]
  noun: [string, string];
  isDeleting?: boolean;
  onClear: () => void;
  onDelete: (close: () => void) => void;
}

// Floating bar shown while list items are selected
export function BulkActionBar({
  count,
  noun,
  isDeleting = false,
  onClear,
  onDelete,
}: BulkActionBarProps) {
  if (count === 0) return null;
  const label = `${count} ${count === 1 ? noun[0] : noun[1]}`;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
      <div className="flex items-center justify-between gap-3 rounded-full border border-[#D9E1E8] bg-white shadow-lg pl-5 pr-2 py-2 font-inter">
        <span className="text-sm font-medium text-foreground">
          {label} selected
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selection"
            className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/70 hover:bg-[#F2F7FB] cursor-pointer"
          >
            <X size={16} />
          </button>
          <ConfirmRevokeModal
            trigger={
              <CustomButton
                variant="destructive"
                className="rounded-full flex flex-row items-center gap-2 px-4 py-2 md:py-2 text-sm"
              >
                <Trash2 size={16} />
                Delete
              </CustomButton>
            }
            title={`Delete ${label}?`}
            description={`This permanently deletes the selected ${count === 1 ? noun[0] : noun[1]}. This can't be undone.`}
            confirmationText="DELETE"
            confirmLabel="Delete"
            pendingLabel="Deleting..."
            isPending={isDeleting}
            onConfirm={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
