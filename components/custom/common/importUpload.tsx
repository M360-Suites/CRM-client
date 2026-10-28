import { useRef, useState } from "react";
import { UploadIcon, Download } from "lucide-react";
import Papa from "papaparse";
import { CustomButton } from "@/components/custom/common/customButton";
import { downloadFile } from "@/lib/handler";

const MAX_SIZE_MB = 5;

interface ImportUploadProps {
  expectedColumns: string[];
  sample: { filename: string; headers: string[]; rows: string[][] };
  onParsed: (
    file: File,
    headers: string[],
    rows: Record<string, string>[],
  ) => void;
}

// Import step 1: drag-and-drop / pick a CSV, parse it, and hand back headers
// and rows
export function ImportUpload({
  expectedColumns,
  sample,
  onParsed,
}: ImportUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);

    if (!/\.csv$/i.test(file.name)) {
      setError("Only CSV files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        if (headers.length === 0) {
          setError(
            "No headers found. Make sure the first row contains column names.",
          );
          return;
        }
        onParsed(file, headers, results.data);
      },
      error: () => {
        setError(
          "Failed to parse file. Please check the format and try again.",
        );
      },
    });
  };

  const handleSampleCSVDownload = () => {
    const csv = Papa.unparse({ fields: sample.headers, data: sample.rows });
    downloadFile(csv, sample.filename, "text/csv;charset=utf-8;");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
          e.target.value = "";
        }}
      />

      <div
        className={`border border-dashed h-40 rounded-[12px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) processFile(file);
        }}
      >
        <UploadIcon size={36} color="#4A4A4A" />
        <span className="text-foreground text-sm font-normal">
          {dragOver ? "Drop your file here" : "Upload your file"}
        </span>
        <span className="text-sm text-foreground">
          CSV only (first row = headers)
        </span>
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}

      <CustomButton
        variant="ghost"
        onClick={handleSampleCSVDownload}
        className="w-full flex flex-row items-center gap-2 rounded-[20px] py-3"
      >
        <Download size={16} />
        <span className="text-sm">Download sample CSV template</span>
      </CustomButton>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-foreground">
          Expected columns (* required, others optional — any extra column is
          kept as a custom field):
        </span>
        <ul className="text-sm text-foreground">
          {expectedColumns.map((col) => (
            <li key={col} className="flex flex-row items-center gap-2 p-2.5">
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="4" cy="4" r="4" fill="#C95C47" />
              </svg>
              {col}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
