"use client";

import { useCompanyStore } from "@/stores/company/company_store";
import { getInitials } from "@/lib/utils";
import { UserRound, Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddCompanyForm from "../forms/add_company";

interface CompanyDetailsSheetProps {
  onDelete: () => void;
  isLoading?: boolean;
  onEdit: () => void;
}

export default function CompanyDetailsSheet({
  onDelete,
  onEdit,
  isLoading,
}: CompanyDetailsSheetProps) {
  const { selectedCompany } = useCompanyStore();

  const fields = [
    {
      icon: UserRound,
      label: "Contact person",
      value: selectedCompany?.contact_person,
    },
    {
      icon: Mail,
      label: "Email address",
      value: selectedCompany?.email,
    },
    {
      icon: Phone,
      label: "Phone",
      value: selectedCompany?.phone,
    },
    {
      icon: MapPin,
      label: "Company address",
      value: selectedCompany?.address,
    },
    {
      icon: Globe,
      label: "Website",
      value: selectedCompany?.website,
    },
    {
      icon: Building2,
      label: "Industry",
      value: selectedCompany?.industry,
    },
  ];

  const stats = [
    { label: "Contacts", value: 0 },
    {
      label: "Deals",
      value: `$${0}`,
    },
    {
      label: "Pipeline value",
      value: `$${0}`,
    },
    {
      label: "Won revenue",
      value: `$${0}`,
    },
  ];

  if (!selectedCompany) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <span className="text-sm text-foreground/50">No company selected</span>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col h-full">
      {/* Company identity */}
      <div className="flex items-center gap-3 px-6 pb-5 border-b border-b-gray-300/60">
        <div className="w-10 h-10 rounded-lg bg-[#F5B7A3] flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-white">
            {getInitials(selectedCompany?.name || "")}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-foreground">
            {selectedCompany?.name}
          </span>
          <span className="text-xs text-foreground/50">
            {selectedCompany?.industry ?? "--------"}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-1 px-6 py-4 border-b border-b-gray-300">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 py-2.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#FFF3E6] flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#E2725B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-foreground">{label}</span>
              <span
                className={`text-sm font-medium ${
                  value ? "text-black" : "text-foreground/30 tracking-widest"
                }`}
              >
                {value ?? "--------"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#F5B7A3] w-full" />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-8 px-6 py-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 p-2.5">
            <span className="text-xs text-black">{label}</span>
            <span className="text-base font-semibold text-black">
              {value ?? "--------"}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-row items-center gap-4 px-6 py-6 mt-auto">
        <button
          onClick={onDelete}
          className="flex-1 py-4 rounded-[12px] border border-[#E2725B] text-base font-medium text-foreground hover:bg-[#FFF3E6] transition-colors cursor-pointer"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>

        <CustomDrawer
          label="Edit Company"
          trigger={
            <button
              className="flex-1 py-4 rounded-[12px] bg-[#E2725B] text-base font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
              onClick={onEdit}
            >
              Edit company
            </button>
          }
        >
          <AddCompanyForm mode="edit" company={selectedCompany} />
        </CustomDrawer>
      </div>
    </div>
  );
}
