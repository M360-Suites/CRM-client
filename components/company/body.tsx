"use client";

import { useGetCompanies } from "@/hooks/company/get_companies";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import CustomPagination from "@/components/custom/common/customPagination";
import AddCompanyForm from "./forms/add_company";
import { Company } from "@/types/company";
import { useEffect, useState } from "react";
import CompanyCard from "./card";
import { toast } from "sonner";
import { useSelection } from "@/hooks/use-selection";
import { SelectCheckbox } from "@/components/custom/common/selectCheckbox";
import { BulkActionBar } from "@/components/custom/common/bulkActionBar";

const CompanySkeleton = () => (
  <div className="w-full bg-white border border-[#ECE7E6] rounded-[8px] p-4 animate-pulse">
    <div className="h-28 bg-gray-200 rounded mb-3" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

export default function Body() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useGetCompanies({ page, limit });

  const companies = data?.data ?? [];
  const totalPages = data?.total_pages ?? 1;
  const { selected, toggle, toggleAll, clear } = useSelection();
  const pageIds = companies.map((c) => c._id);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;

  // Selection only covers the visible page
  useEffect(clear, [clear, page, limit]);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full">
        {isLoading ? (
          <div className="py-2 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <CompanySkeleton key={i} />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              No companies yet
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
              {(close) => <AddCompanyForm mode="add" onSuccess={close} />}
            </CustomDrawer>
          </div>
        ) : (
          <div className="w-full px-2">
            <div className="flex items-center gap-3 py-2">
              <SelectCheckbox
                label="Select all companies on this page"
                checked={pageIds.length > 0 && selectedOnPage === pageIds.length}
                indeterminate={
                  selectedOnPage > 0 && selectedOnPage < pageIds.length
                }
                onChange={() => toggleAll(pageIds)}
              />
              <span className="text-sm text-foreground">
                {selectedOnPage > 0 ? `${selectedOnPage} selected` : "Select all"}
              </span>
            </div>
            <div className="py-2 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
              {companies.map((company: Company) => (
                <CompanyCard
                  key={company._id}
                  company={company}
                  selected={selected.has(company._id)}
                  onToggleSelect={() => toggle(company._id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <CustomPagination
                  page={page}
                  limit={limit}
                  totalPages={totalPages}
                  onPageChange={(newPage: number) => {
                    setPage(newPage);
                  }}
                  onLimitChange={(newLimit: number) => {
                    setLimit(newLimit);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <BulkActionBar
        count={selected.size}
        noun={["company", "companies"]}
        onClear={clear}
        onDelete={(close) => {
          // TODO: call the bulk delete endpoint once the backend adds one
          toast.info("Bulk delete isn't available yet");
          close();
        }}
      />
    </div>
  );
}
