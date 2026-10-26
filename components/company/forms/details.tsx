"use client";

import { useCompanyStore } from "@/stores/company/company_store";
import { getInitials } from "@/lib/utils";
import { UserRound, Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import { CustomButton } from "@/components/custom/common/customButton";
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
    { label: "Contacts", value: selectedCompany?.stats.contact_count || 0 },
    {
      label: "Deals",
      value: selectedCompany?.stats.deal_count || 0,
    },
    {
      label: "Pipeline value",
      value: `$${selectedCompany?.stats.pipeline_value || 0}`,
    },
    {
      label: "Won revenue",
      value: `$${selectedCompany?.stats.won_revenue || 0}`,
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
        <div className="w-10 h-10 rounded-lg bg-[#D8F3F1] flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-[#2F9E94]">
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
      <div className="flex flex-col gap-1 px-6 py-4 border-b border-b-gray-300/60">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 py-2.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#D8F3F1] flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#2F9E94]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-foreground">{label}</span>
              <span
                className={`text-sm font-medium ${value ? "text-black" : "text-foreground/30 tracking-widest"
                  }`}
              >
                {value ?? "--------"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 px-6 py-3">
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
        <CustomButton
          variant="outline"
          onClick={onDelete}
          disabled={isLoading}
          className="py-4 px-5 flex-1 text-base"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </CustomButton>

        <CustomDrawer
          label="Edit Company"
          trigger={
            <CustomButton className="py-4 px-5 flex-1 text-base" onClick={onEdit}>
              Edit company
            </CustomButton>
          }
        >
          {(close) => (
            <AddCompanyForm
              mode="edit"
              company={selectedCompany}
              onSuccess={() => close()}
            />
          )}
        </CustomDrawer>
      </div>
    </div>
  );
}
