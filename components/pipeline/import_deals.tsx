"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";
import { ImportStepper } from "@/components/custom/common/importStepper";
import { ImportUpload } from "@/components/custom/common/importUpload";
import { ImportMapping } from "@/components/custom/common/importMapping";
import { ImportPreview } from "@/components/custom/common/importPreview";
import { useDealBulkImport } from "@/hooks/pipeline/bulk_import_deals";
import { DEAL_IMPORT_FIELDS, normalizeDate } from "@/lib/import";
import { BulkImportResult } from "@/types/pipeline";

const EXPECTED_COLUMNS = [
  "Deal title *",
  "Value / Amount (5000, $5,000, 5k)",
  "Currency",
  "Status (open/won/lost)",
  "Stage (defaults to the first open stage)",
  "Expected close date",
  "Company (linked if it exists)",
  "Contact email (linked if the contact exists)",
  "Source, Industry, Description",
];

const SAMPLE = {
  filename: "sample_deals.csv",
  headers: [
    "title",
    "value",
    "currency",
    "stage",
    "expected_close_date",
    "company",
    "contact_email",
    "source",
  ],
  rows: [
    [
      "Fleet tracking rollout",
      "2500000",
      "NGN",
      "Proposal",
      "2026-12-15",
      "Brightwave Logistics",
      "amaka.eze@brightwave.ng",
      "Referral",
    ],
    [
      "API integration package",
      "$8,000",
      "USD",
      "Discovery",
      "2026-11-30",
      "Tidal Finance",
      "ibrahim@tidalfinance.io",
      "Event",
    ],
  ],
};

// Backend expects lowercase status and ISO close dates
const normalizeValue = (header: string, value: string) => {
  if (header === "status") return value.toLowerCase();
  if (header === "expected_close_date") return normalizeDate(value);
  return value;
};

export default function ImportDeals({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const { mutate: bulkImport, isPending, error } = useDealBulkImport();

  return (
    <div>
      <div className="flex flex-col w-full justify-center items-center">
        <ImportStepper current={step} />
      </div>

      {step === 1 && (
        <div className="pt-6 px-5">
          <ImportUpload
            expectedColumns={EXPECTED_COLUMNS}
            sample={SAMPLE}
            onParsed={(f, h, r) => {
              setFile(f);
              setHeaders(h);
              setRows(r);
              setMapping({});
              setStep(2);
            }}
          />
        </div>
      )}

      {step === 2 && (
        <ImportMapping
          headers={headers}
          rows={rows}
          fields={DEAL_IMPORT_FIELDS}
          savedMapping={mapping}
          onBack={() => setStep(1)}
          onConfirm={(confirmed) => {
            setMapping(confirmed);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <ImportPreview
          file={file}
          headers={headers}
          rows={rows}
          mapping={mapping}
          fields={DEAL_IMPORT_FIELDS}
          transform={normalizeValue}
          isPending={isPending}
          error={error}
          onBack={() => setStep(2)}
          onImport={(normalized) =>
            bulkImport(normalized, {
              onSuccess: (res) => {
                if (!res.status) return;
                setResult(res.data ?? null);
                setStep(4);
              },
            })
          }
        />
      )}

      {step === 4 && <ImportResult result={result} onDone={onSuccess} />}
    </div>
  );
}

function ImportResult({
  result,
  onDone,
}: {
  result: BulkImportResult | null;
  onDone: () => void;
}) {
  const errors = result?.errors ?? [];

  return (
    <div className="flex flex-col gap-6 w-full pt-8 px-7">
      <div className="bg-[#FFF6EC] py-8 rounded-[10px] flex flex-col items-center justify-center gap-2">
        <Check size={36} color="#E2725B" />
        <span className="text-foreground text-sm font-normal text-center">
          {result
            ? `${result.imported} deal${result.imported === 1 ? "" : "s"} imported${
                result.failed ? `, ${result.failed} failed` : ""
              }.`
            : "Your deals have been imported!"}
        </span>
        {!!result?.custom_columns?.length && (
          <span className="text-xs text-muted-foreground text-center px-4">
            Saved as custom fields: {result.custom_columns.join(", ")}
          </span>
        )}
      </div>

      {errors.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Rows that failed
          </span>
          <ul className="max-h-48 overflow-y-auto rounded-[10px] border border-border divide-y divide-border">
            {errors.map((e, i) => (
              <li key={i} className="px-3 py-2 text-xs text-foreground">
                {e.row !== undefined && (
                  <span className="font-medium">Row {e.row}: </span>
                )}
                {e.message ?? e.error ?? JSON.stringify(e)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-10">
        <CustomButton className="w-full py-3" onClick={onDone}>
          Done
        </CustomButton>
      </div>
    </div>
  );
}
