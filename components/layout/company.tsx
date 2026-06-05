"use client";
import { FileText } from "lucide-react";
import { useCompanyStore } from "@/stores/company/company_store";

const steps = [
  {
    id: 1,
    name: "Upload",
  },
  {
    id: 2,
    name: "Map",
  },
  {
    id: 3,
    name: "Preview",
  },
  {
    id: 4,
    name: "Done",
  },
];

export default function ImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { importSteps, completedSteps, rows } = useCompanyStore();

  return (
    <div>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-col items-center mb-2">
          {/* Row 1: circles + dashes */}
          <div className="flex flex-row items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-7.5 h-7.5 rounded-full flex items-center justify-center ${
                    completedSteps.includes(step.id)
                      ? "bg-[#C95C47]"
                      : importSteps === step.id
                        ? "bg-[#C95C47]"
                        : "bg-[#F5B7A3]"
                  }`}
                >
                  <span className="text-xs font-medium text-white">
                    {step.id}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="relative w-12 h-0.5 mx-2">
                    <div
                      className={`absolute inset-0 ${completedSteps.includes(step.id) ? "bg-[#C95C47]" : importSteps === step.id ? "bg-[#C95C47]" : "bg-[#D9D9D9]"} rounded-full`}
                    />
                    <div
                      className={`absolute top-0 left-0 h-full bg-[#C95C47] rounded-full`}
                      style={{
                        width: importSteps > step.id ? "100%" : "0%",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Row 2: labels, each centered under its circle */}
          <div className="flex flex-row items-start mt-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <span
                  className={`text-sm font-normal w-10 text-center text-foreground`}
                >
                  {step.name}
                </span>
                {/* Spacer to account for dash width between circles */}
                {index < steps.length - 1 && <div className="w-14" />}
              </div>
            ))}
          </div>
        </div>
        {importSteps === 2 && (
          <div className="flex flex-row items-center gap-2">
            <FileText size={14} color="#3A2418" />
            <span className="text-[#3A2418] text-sm">
              {rows.length} rows detected. Match your file&apos;s columns to
              fields:
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
