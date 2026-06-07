"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const limitOptions = [10, 25];

export default function CustomPagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4 w-full pt-3">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground whitespace-nowrap">
          Rows per page
        </span>
        <select
          value={limit}
          onChange={(e) => {
            onLimitChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="border border-[#E8E8E8] rounded-[8px] px-2 py-1.5 text-sm text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-[#C95C47]"
        >
          {limitOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Page info + navigation */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-[8px] border border-[#E8E8E8] text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF6EC] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-[8px] border border-[#E8E8E8] text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF6EC] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
