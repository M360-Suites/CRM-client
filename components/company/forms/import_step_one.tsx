import { useRef, useState } from "react";
import { UploadIcon, Download } from "lucide-react";
import { useCompanyStore } from "@/stores/company/company_store";
import { CustomButton } from "@/components/custom/common/customButton";
import Papa from "papaparse";

export default function ImportStepOne() {
  const { setImportSteps, setCompletedSteps, setFile, setHeaders, setRows } =
    useCompanyStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ACCEPTED_TYPES = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const MAX_SIZE_MB = 5;

  const processFile = (file: File) => {
    setError(null);

    if (
      !ACCEPTED_TYPES.includes(file.type) &&
      !file.name.match(/\.(csv|xlsx|xls)$/i)
    ) {
      setError("Only CSV, XLSX, or XLS files are allowed.");
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
        const rows = results.data;

        if (headers.length === 0) {
          setError(
            "No headers found. Make sure the first row contains column names.",
          );
          return;
        }

        setFile(file);
        setHeaders(headers);
        setRows(rows);
        setCompletedSteps([1]);
        setImportSteps(2);
      },
      error: () => {
        setError(
          "Failed to parse file. Please check the format and try again.",
        );
      },
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSampleCSVDownload = () => {
    const headers = [
      "name",
      "industry",
      "website",
      "contact_person",
      "email",
      "phone",
      "address",
      "notes",
    ];
    const rows = [
      [
        "Acme Corp",
        "Software",
        "https://acmecorp.com",
        "James Whitfield",
        "james@acmecorp.com",
        "+2348011111111",
        "14 Tech Avenue, Lagos",
        "Key enterprise account",
      ],
      [
        "Globex Industries",
        "Manufacturing",
        "https://globex.com",
        "Sandra Obi",
        "sandra@globex.com",
        "+2348022222222",
        "7 Factory Road, Kano",
        "Long-term partner",
      ],
      [
        "Pied Piper",
        "SaaS",
        "https://piedpiper.com",
        "Richard Nwosu",
        "richard@piedpiper.com",
        "+2348088888888",
        "18 Silicon Way, Lagos",
        "Demo scheduled",
      ],
      [
        "NexaHealth",
        "HealthTech",
        "https://nexahealth.com",
        "Samuel Bello",
        "samuel@nexahealth.com",
        "+2348022334455",
        "10 Health Boulevard, Abuja",
        "High priority",
      ],
    ];

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_companies.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileInput}
      />

      <div
        className={`border border-dashed h-60 rounded-[12px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
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
        <UploadIcon size={36} color="#4A4A4A" />
        <span className="text-foreground text-sm font-normal">
          {dragOver ? "Drop your file here" : "Upload your file"}
        </span>
        <span className="text-sm text-foreground">
          CSV, XLSX, or XLS (first row = headers)
        </span>
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}

      <CustomButton
        variant="ghost"
        onClick={handleSampleCSVDownload}
        className="w-full flex flex-row items-center gap-2 rounded-[20px] py-3.5"
      >
        <Download size={16} />
        <span className="text-sm">Download sample CSV template</span>
      </CustomButton>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-foreground">Expected columns:</span>
        <ul className="text-sm text-foreground">
          {["Company name", "Industry", "Website", "Notes"].map((col) => (
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
