import {
  Download,
  Trash2,
  FileText,
  Loader,
  Pencil,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Document } from "@/types/document";
import { useDeleteFile } from "@/hooks/document/delete_file";
import { CustomPopover } from "../custom/common/customPopover";
import DocumentPreview from "./documentPreview";
import { CustomDrawer } from "../custom/common/drawer";

interface FileItemProps {
  file: Document;
  onEdit?: () => void;
}

export default function FileItem({ file, onEdit }: FileItemProps) {
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();

  const handleDownload = async () => {
    const response = await fetch(file.cloudinary_url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.original_name;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex items-center justify-between bg-[#FFF3E6] max-md:grid max-md:grid-cols-3 max-md:gap-6 max-md:w-full first:rounded-t-[8px] last:rounded-b-[8px] border-b border-b-border last:border-b-0 pl-4 max-md:pl-2 pr-8 max-md:pr-2 py-2.5 overflow-hidden">
      {/* Icon + Info */}
      <div className="flex items-center gap-4 max-md:gap-2 max-md:col-span-2 py-0.5 ">
        <div className="w-9 h-9 max-md:h-6 max-md:w-6 p-1 rounded-[8px] bg-[#FFD9C0] flex items-center justify-center">
          <FileText className="text-[#3A2418] text-2xl max-md:text-base" />
        </div>
        <div className="flex flex-col gap-1.5 truncate">
          <span className="text-sm max-md:text-xs font-medium truncate text-[#3A2418]">
            {file.original_name}
          </span>
          <span className="text-xs max-md:text-[10px] text-foreground">
            {(file.file_size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>

      <div className="py-0.5 flex flex-col items-end justify-center">
        <CustomPopover
          trigger={<MoreVertical size={17} className="text-foreground/80" />}
        >
          <div className="flex flex-col w-36 max-md:w-32 pt-2">
            <CustomDrawer
              trigger={
                <button className="flex items-center gap-2.5 px-2.5 py-2 text-foreground hover:text-foreground/70 transition-colors cursor-pointer">
                  <Eye size={16} color="#4A4A4A" />
                  Preview
                </button>
              }
              label={file.original_name}
            >
              {(close) => (
                <DocumentPreview document={file} onSuccess={() => close()} />
              )}
            </CustomDrawer>

            <button
              className="flex items-center gap-2.5 px-2.5 py-2 text-foreground hover:text-foreground/70 transition-colors cursor-pointer"
              onClick={onEdit}
            >
              <Pencil size={16} color="#4A4A4A" />
              Rename
            </button>
            <button
              className="flex items-center gap-2.5 px-2.5 py-2 text-foreground hover:text-foreground/70 transition-colors cursor-pointer"
              onClick={handleDownload}
            >
              <Download size={17} color="#4A4A4A" />
              Download
            </button>
            <button
              className="flex items-center gap-2.5 px-2.5 py-2 text-[#FB3748] transition-colors cursor-pointer"
              onClick={() => deleteFile(file._id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader size={17} className="animate-spin" color="#FB3748" />
              ) : (
                <Trash2 size={17} color="#FB3748" />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </CustomPopover>
      </div>
    </div>
  );
}
