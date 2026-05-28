import { Download, Trash2, FileText } from "lucide-react";
import { useDocumentStore } from "@/stores/document/doc_store";
import { Document } from "@/types/document";

interface FileItemProps {
  file: Document;
}

export default function FileItem({ file }: FileItemProps) {
  const { onDownload, onDelete } = useDocumentStore();

  return (
    <div className="flex items-center justify-between bg-[#FFF3E6] first:rounded-t-[8px] last:rounded-b-[8px] border-b border-b-border last:border-b-0 pl-4 pr-8 py-2.5 overflow-hidden">
      {/* Icon + Info */}
      <div className="flex items-center gap-4 py-0.5">
        <div className="w-9 h-9 rounded-[8px] bg-[#FFD9C0] flex items-center justify-center shrink-0">
          <FileText size={16} className="text-[#3A2418]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#3A2418]">
            {file.original_name}
          </span>
          <span className="text-xs text-foreground">
            {`${file.file_size / 1024} KB`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer">
          <Download size={17} color="#4A4A4A" />
        </button>
        <button className="text-[#FB3748] transition-colors cursor-pointer">
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
