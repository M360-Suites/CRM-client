"use client";
import { useQuery } from "@tanstack/react-query";
import { getReportContactTemperature } from "@/services/report/get_report_temp";
import { ContactTemperatureData } from "@/types/report";

export const useReportLeadTemp = () => {
  return useQuery<ContactTemperatureData>({
    queryKey: ["report", "lead-source"],
    queryFn: getReportContactTemperature,
    refetchInterval: 10 * 60 * 1000,
  });
};
