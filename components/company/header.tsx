"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { Download, UploadIcon, PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddCompanyForm from "./forms/add_company";
import ImportCompanies from "./import";
import { useCompanyStore } from "@/stores/company/company_store";
import { useGetCompanies } from "@/hooks/company/get_companies";
import { downloadFile } from "@/lib/handler";

export default function Header() {
  const { data: companies } = useGetCompanies({});

  const handleExport = (format: "csv" | "json") => {
    if (!companies?.data.length) return;

    if (format === "json") {
      const json = JSON.stringify(companies, null, 2);
      downloadFile(json, "companies.json", "application/json");
      return;
    }

    // CSV
    const headers = Object.keys(companies.data[0]).join(",");
    const rows = companies.data.map((c) =>
      Object.values(c)
        .map((v) => (typeof v === "string" ? `"${v.replace(/"/g, '""')}"` : v))
        .join(","),
    );
    const csv = [headers, ...rows].join("\n");
    downloadFile(csv, "companies.csv", "text/csv");
  };

  return (
    <div className="w-full pt-8">
      <div className="flex max-md:flex-col items-center max-lg:items-start max-lg:gap-5 justify-between w-full">
        <div className="flex flex-row items-start gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="xl:text-2xl md:text-xl/[110%] text-lg/[110%] font-medium text-[#3A2418]">
              Companies
            </h2>
            <span className="xl:text-base text-sm font-medium text-foreground">
              {companies?.total} companies
            </span>
          </div>
          <span className="text-[#E2725B] xl:text-sm sm:text-xs text-[10px] bg-[#FFF3E6] border border-border rounded-full py-1 px-3">
            Sales rep
          </span>
        </div>

        <div className="flex flex-row gap-4 max-md:gap-2">
          <CustomDrawer
            label="Export Companies"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 md:px-5 px-3 py-2.5"
              >
                <UploadIcon className="" />
                <span>Export</span>
              </CustomButton>
            }
          >
            <div className="px-4">
              <p className="text-sm font-normal text-foreground/70 mt-5">
                Choose the format you want to export your companies in.
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <CustomButton
                  onClick={() => handleExport("csv")}
                  variant="default"
                  className="w-full py-3"
                >
                  CSV
                </CustomButton>
                <CustomButton
                  onClick={() => handleExport("json")}
                  variant="ghost"
                  className="w-full py-3"
                >
                  JSON
                </CustomButton>
              </div>
            </div>
          </CustomDrawer>

          <CustomDrawer
            label="Import Companies"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 md:px-5 px-3 py-2.5"
              >
                <Download className="" />
                <span>Import</span>
              </CustomButton>
            }
          >
            {(close) => <ImportCompanies onSuccess={() => close()} />}
          </CustomDrawer>
          <CustomDrawer
            label="Add Company"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex flex-row items-center gap-2 md:px-5 px-3 py-2.5"
              >
                <PlusIcon className="" />
                <span>Add Company</span>
              </CustomButton>
            }
          >
            {(close) => (
              <AddCompanyForm
                mode="add"
                onSuccess={() => {
                  close();
                }}
              />
            )}
          </CustomDrawer>
        </div>
      </div>
    </div>
  );
}
