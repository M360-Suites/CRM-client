"use client";

import { useRef, useState } from "react";
import {
  UploadIcon,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

interface FileUploadProps {
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: (file: File) => void;
}

export default function FileUpload({
  multiple = true,
  accept = ".pdf,.doc,.docx,.xlsx,.csv,.png,.jpg,.jpeg",
  maxSizeMB = 10,
  onUpload,
  onRemove,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const maxBytes = maxSizeMB * 1024 * 1024;

    const validFiles = fileArray.filter((f) => {
      if (f.size > maxBytes) return false;
      return true;
    });

    // add all as "uploading"
    const newEntries: UploadedFile[] = validFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: "uploading",
    }));

    setUploadedFiles((prev) => [...prev, ...newEntries]);

    // simulate progress per file, then call onUpload
    for (const entry of newEntries) {
      // simulate progress ticks
      for (let p = 10; p <= 90; p += 20) {
        await new Promise((r) => setTimeout(r, 150));
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, progress: p } : f)),
        );
      }

      try {
        await onUpload([entry.file]);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === entry.id ? { ...f, progress: 100, status: "done" } : f,
          ),
        );
      } catch (err) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === entry.id
              ? {
                  ...f,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : f,
          ),
        );
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = ""; // reset so same file can be re-added
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const handleRemove = (entry: UploadedFile) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== entry.id));
    onRemove?.(entry.file);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Drop zone */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileInput}
      />
      <div
        className={`border border-dashed rounded-[12px] h-36 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <UploadIcon size={28} color="#4A4A4A" />
        <span className="text-sm text-foreground font-normal">
          {dragOver ? "Drop files here" : "Click or drag files to upload"}
        </span>
        <span className="text-xs text-muted-foreground">
          {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")} · Max{" "}
          {maxSizeMB}MB
        </span>
      </div>

      {/* File list */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploadedFiles.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-1.5 border border-border rounded-[10px] px-3 py-2.5"
            >
              <div className="flex flex-row items-center justify-between gap-3">
                <div className="flex flex-row items-center gap-2 min-w-0">
                  {entry.status === "done" ? (
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                  ) : entry.status === "error" ? (
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                  ) : (
                    <FileText size={16} color="#4A4A4A" className="shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-foreground truncate">
                      {entry.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(entry.file.size)}
                      {entry.status === "error" && (
                        <span className="text-red-500 ml-1">
                          · {entry.error}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(entry)}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Progress bar */}
              {entry.status === "uploading" && (
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C95C47] rounded-full transition-all duration-200"
                    style={{ width: `${entry.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-row items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {uploadedFiles.filter((f) => f.status === "done").length} of{" "}
            {uploadedFiles.length} uploaded
          </span>
          <CustomButton
            variant="ghost"
            className="text-xs h-auto py-1 px-2 text-red-500 hover:text-red-600"
            onClick={() => setUploadedFiles([])}
          >
            Clear all
          </CustomButton>
        </div>
      )}
    </div>
  );
}
