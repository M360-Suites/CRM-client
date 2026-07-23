import {
  Trash2,
  MoreVertical,
  FileText,
  FolderOpen,
  Pencil,
  Loader2,
} from "lucide-react";
import { CustomPopover } from "../custom/common/customPopover";
import { toUTC } from "@/lib/utils";
import { Folder } from "@/types/document";

interface FolderItemProps {
  folder: Folder;
  isDeleting: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete: () => void;
}
export default function FolderItem({
  folder,
  isDeleting,
  onClick,
  onEdit,
  onDelete,
}: FolderItemProps) {
  return (
    <div className="w-full bg-[#FFF3E6]/20 hover:bg-gray-50 hover:cursor-pointer grid grid-cols-6 border-b gap-1 lg:gap-5 md:gap-3 border-b-border last:border-b-0 pl-2 md:pr-8 pr-1 py-2.5 overflow-hidden">
      {/* Icon + Info */}
      <div
        className="flex items-center md:gap-3 gap-1.5 py-0.5 col-span-2"
        onClick={onClick}
      >
        <div className="md:w-9 md:h-9 w-4 h-4 rounded-[8px] flex items-center justify-center shrink-0">
          <svg
            width="19"
            height="15"
            viewBox="0 0 19 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 2.5H17.5C18.05 2.5 18.5 2.95 18.5 3.5V13.5C18.5 14.05 18.05 14.5 17.5 14.5H1.5C0.95 14.5 0.5 14.05 0.5 13.5V2.5H9.5Z"
              fill="#F5B7A3"
              stroke="#E2725B"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 2.5H0.5V1.5C0.5 0.95 0.95 0.5 1.5 0.5H7.5L9.5 2.5Z"
              stroke="#E2725B"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-xs max-md:text-[10px] font-medium text-foreground truncate">
          {folder.name}
        </span>
      </div>
      <div className="flex  items-center gap-4 py-0.5">
        <span className="text-xs max-md:text-[10px] font-normal truncate text-foreground">
          {folder.description}
        </span>
      </div>
      <div className=" flex items-center gap-2 py-0.5">
        <FileText size={16} className="text-foreground max-md:hidden" />
        <span className="md:text-xs text-[10px] text-center text-foreground">
          {folder.document_count}{" "}
          {folder.document_count <= 1 ? "item" : "items"}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 py-0.5 w-full">
        <span className="md:text-xs text-[10px] truncate text-foreground">
          {toUTC(folder.updated_at)}
        </span>
        <span className="md:text-xs text-[10px] truncate text-foreground">
          by {folder.last_modified_by?.display_name}
        </span>
      </div>
      <div className="py-0.5 flex flex-col items-end justify-center">
        <CustomPopover
          trigger={<MoreVertical size={17} className="text-foreground/80" />}
        >
          <div className="flex flex-col w-36 max-md:w-32 pt-2">
            <button
              onClick={onClick}
              className="flex items-center gap-2.5 px-2.5 py-2 text-sm max-md:text-xs text-foreground hover:bg-gray-100 rounded-md transition-colors w-full text-left"
            >
              <FolderOpen size={15} className="text-foreground/70" />
              Open
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2.5 px-2.5 py-2 text-sm max-md:text-xs text-foreground hover:bg-gray-100 rounded-md transition-colors w-full text-left"
            >
              <Pencil size={15} className="text-foreground/70" />
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center gap-2.5 px-2.5 max-md:text-xs py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors w-full text-left disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </CustomPopover>
      </div>
    </div>
  );
}
