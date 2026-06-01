"use client";
import { useQuery } from "@tanstack/react-query";
import { getReportsSummary } from "@/services/report/get_report_summary";
import { ReportSummary } from "@/types/report";

export const useReportSummary = () => {
  return useQuery<ReportSummary>({
    queryKey: ["report"],
    queryFn: getReportsSummary,
    refetchInterval: 10 * 60 * 1000,
  });
};
