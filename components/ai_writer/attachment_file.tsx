"use client";

import { useRef, useState } from "react";
import { Paperclip, X, FileText } from "lucide-react";

interface AttachmentUploadProps {
  onFilesChange: (files: File[]) => void;
  triggerOnly?: boolean;
  listOnly?: boolean;
  files?: File[];
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const MAX_SIZE_MB = 10;

export default function AttachmentUpload({
  onFilesChange,
  triggerOnly = false,
  listOnly = false,
  files: externalFiles,
}: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const files = externalFiles ?? internalFiles;

  const processFiles = (incoming: File[]) => {
    setError(null);

    const invalid = incoming.find(
      (f) =>
        !ACCEPTED_TYPES.includes(f.type) &&
        !f.name.match(/\.(pdf|doc|docx|txt)$/i),
    );
    if (invalid) {
      setError("Only PDF, DOC, DOCX, or TXT files are allowed.");
      return;
    }

    const oversized = incoming.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setError(`Each file must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    const updated = [
      ...files,
      ...incoming.filter(
        (f) => !files.some((existing) => existing.name === f.name),
      ),
    ];
    if (!externalFiles) setInternalFiles(updated);
    onFilesChange(updated);
  };

  const removeFile = (name: string) => {
    const updated = files.filter((f) => f.name !== name);
    if (!externalFiles) setInternalFiles(updated);
    onFilesChange(updated);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    processFiles(selected);
    e.target.value = "";
  };

  // trigger only — just the button
  if (triggerOnly) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-sm text-[#4A4A4A] font-medium"
        >
          <Paperclip size={16} color="#F5B7A3" />
          <span>Attachment</span>
        </button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </>
    );
  }

  // list only — just the file list
  if (listOnly) {
    return (
      <div className="flex flex-col gap-1.5">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex items-center justify-between bg-[#FFF6EC] rounded-[8px] px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText size={14} color="#C95C47" className="shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#3A2418] truncate">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatSize(file.size)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(file.name)}
              className="shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // default — trigger + list together
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 text-sm text-[#4A4A4A] font-medium"
      >
        <Paperclip size={16} color="#F5B7A3" />
        <span>Attachment</span>
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between bg-[#FFF6EC] rounded-[8px] px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} color="#C95C47" className="shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-[#3A2418] truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.name)}
                className="shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
