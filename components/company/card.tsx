import { Eye, Pencil } from "lucide-react";
import { CustomDrawer } from "../custom/common/drawer";
import AddCompanyForm from "./forms/add_company";
import CompanyDetailsSheet from "./forms/details";
import { useCompanyStore } from "@/stores/company/company_store";
import { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const { setSelectedCompany, selectedCompany } = useCompanyStore();
  return (
    <div className="w-95 bg-white border border-[#F3D9C4] rounded-[8px] p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-lg bg-[#F5B7A3] flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-foreground">
              {company?.companyName.charAt(0) ?? "-----"}
            </span>
          </div>

          {/* Name + Industry */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {company?.companyName ?? "-----"}
            </span>
            <span className="text-xs text-foreground">
              {company?.industry ?? "-----"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row items-center gap-4">
          <CustomDrawer
            label="Company Details"
            trigger={
              <button
                className="text-[#E2725B] hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => setSelectedCompany(company)}
              >
                <Eye size={20} />
              </button>
            }
          >
            <CompanyDetailsSheet
              onDelete={() => console.log("Delete")}
              onEdit={() => console.log("Edit")}
            />
          </CustomDrawer>
          <CustomDrawer
            label="Edit Company"
            trigger={
              <button
                className="text-[#E2725B] hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => setSelectedCompany(company)}
              >
                <Pencil size={20} />
              </button>
            }
          >
            <AddCompanyForm company={selectedCompany ?? undefined} />
          </CustomDrawer>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F5B7A3]" />

      {/* Stats */}
      <div className="flex flex-row items-start gap-16 py-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-black">Contacts</span>
          <span className="text-sm font-medium text-black">
            {company?.contact || 0}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-black">Won revenue</span>
          <span className="text-sm font-medium text-black">
            ${company?.wonRevenue?.toLocaleString() || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
