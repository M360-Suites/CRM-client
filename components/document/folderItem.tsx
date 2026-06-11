import { Download, Trash2, MoreVertical, FileText } from "lucide-react";
import { toUTC } from "@/lib/utils";
import { Folder } from "@/types/document";

interface FolderItemProps {
  folder: Folder;
  onClick: () => void;
}
export default function FolderItem({ folder, onClick }: FolderItemProps) {
  return (
    <div className="w-full bg-[#FFF3E6]/20 hover:bg-gray-50 hover:cursor-pointer grid grid-cols-6 border-b gap-3 xl:gap-5 border-b-border last:border-b-0 pl-4 pr-8 py-2.5 overflow-hidden">
      {/* Icon + Info */}
      <div
        className="flex items-center gap-3 py-0.5 col-span-1"
        onClick={onClick}
      >
        <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0">
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
        <span className="text-xs font-medium text-foreground truncate">
          {folder.name}
        </span>
      </div>
      <div className="col-span-2 flex items-center gap-4 py-0.5">
        <span className="text-xs font-normal text-foreground truncate">
          {folder.description}
        </span>
      </div>
      <div className=" flex items-center gap-2 py-0.5">
        <FileText size={16} className="text-foreground" />
        <span className="text-xs text-foreground">
          {folder.document_count} files
        </span>
      </div>
      <div className="flex flex-col gap-1.5 py-0.5">
        <span className="text-xs text-foreground">
          {toUTC(folder.updated_at)}
        </span>
        <span className="text-xs text-foreground">
          by {folder.last_modified_by?.display_name}
        </span>
      </div>
      <div className="py-0.5 flex flex-col items-end justify-center">
        <MoreVertical size={17} className="text-foreground/80" />
      </div>
    </div>
  );
}
