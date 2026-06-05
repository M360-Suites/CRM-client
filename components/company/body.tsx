"use client";

import { useGetCompanies } from "@/hooks/company/get_companies";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddCompanyForm from "./forms/add_company";
import { Company } from "@/types/company";
import CompanyCard from "./card";

export default function Body() {
  const { data: companies, isLoading } = useGetCompanies();

  const CompanySkeleton = () => (
    <div className="w-full bg-white border border-[#F3D9C4] rounded-[8px] p-4 animate-pulse">
      <div className="h-28 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );

  return (
    <div className="w-full flex-col flex gap-8">
      <div className="w-full">
        {isLoading ? (
          <div className="py-2 grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CompanySkeleton key={i} />
            ))}
          </div>
        ) : companies?.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              No contacts yet
            </span>
            <CustomDrawer
              label="Add Company"
              trigger={
                <CustomButton
                  variant="default"
                  className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
                >
                  <span>Add your first company</span>
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
        ) : (
          <div className="py-2 grid grid-cols-3 gap-4">
            {companies?.map((company: Company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
