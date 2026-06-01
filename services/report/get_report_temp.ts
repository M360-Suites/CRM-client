import { apiClient } from "../apiclient";
import { ContactTemperatureData } from "@/types/report";

export const getReportContactTemperature = async () => {
  const response = await apiClient.get("/reports/contact-temperature");
  return response.data as ContactTemperatureData;
};
