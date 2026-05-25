"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { Download, UploadIcon, PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddCompanyForm from "./forms/add_company";
import ImportContacts from "./import";
import { useCompanyStore } from "@/stores/company/company_store";
import { useGetCompanies } from "@/hooks/company/get_companies";

export default function Header() {
  const { importSteps } = useCompanyStore();
  const { data: companies } = useGetCompanies();

  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-start gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-medium text-[#3A2418]">Companies</h2>
            <span className="text-base font-medium text-foreground">
              {companies?.length} companies
            </span>
          </div>
          <span className="text-[#E2725B] text-sm bg-[#FFF3E6] border border-border rounded-full py-1 px-3">
            Sales rep
          </span>
        </div>

        <div className="flex flex-row gap-4">
          <CustomDrawer
            label="Export Companies"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
              >
                <UploadIcon className="" />
                <span>Export</span>
              </CustomButton>
            }
          >
            <div className="p-4">
              <span className="text-lg font-medium text-foreground">
                Export Companies
              </span>
              <p className="text-sm font-normal text-foreground/70 mt-2">
                Choose the format you want to export your companies in.
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <CustomButton variant="outline" className="w-full">
                  CSV
                </CustomButton>
                <CustomButton variant="outline" className="w-full">
                  Excel
                </CustomButton>
                <CustomButton variant="outline" className="w-full">
                  PDF
                </CustomButton>
              </div>
            </div>
          </CustomDrawer>

          <CustomDrawer
            label="Import Companies"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
              >
                <Download className="" />
                <span>Import</span>
              </CustomButton>
            }
          >
            {(close) => (
              <ImportContacts
                onSuccess={importSteps === 4 ? () => close() : undefined}
              />
            )}
          </CustomDrawer>
          <CustomDrawer
            label="Add Company"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
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
