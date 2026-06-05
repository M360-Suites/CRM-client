import { Download, Trash2, FileText, Loader } from "lucide-react";
import { Document } from "@/types/document";
import { useDeleteFile } from "@/hooks/document/delete_file";

interface FileItemProps {
  file: Document;
}

export default function FileItem({ file }: FileItemProps) {
  const { mutate: deleteFile, isPending } = useDeleteFile();

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
            {(file.file_size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button
          className="text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer"
          onClick={handleDownload}
        >
          <Download size={17} color="#4A4A4A" />
        </button>
        <button
          className="text-[#FB3748] transition-colors cursor-pointer"
          onClick={() => deleteFile(file._id)}
        >
          {isPending ? (
            <Loader size={17} className="animate-spin" color="#FB3748" />
          ) : (
            <Trash2 size={17} color="#FB3748" />
          )}
        </button>
      </div>
    </div>
  );
}
