"use client";

import { useCompanyStore } from "@/stores/company/company_store";
import { CustomButton } from "@/components/custom/common/customButton";
import CompanyCard from "./card";

export default function Body() {
  const { companies } = useCompanyStore();

  return (
    <div className="w-full flex-col flex gap-8">
      <div className="w-full">
        {companies.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              No contacts yet
            </span>
            <CustomButton className="px-4 py-2 rounded-full">
              <span className="text-sm ">Add your first Contact</span>
            </CustomButton>
          </div>
        ) : (
          <div className="py-2 grid grid-cols-3">
            {companies.map((contact) => (
              <CompanyCard key={contact.id} company={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
