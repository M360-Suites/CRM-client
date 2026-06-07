import { apiClient } from "../apiclient";
import { GmailDataResponse } from "@/types/gmail";

interface MailProps {
  page?: number;
  limit?: number;
}

export const getMails = async (props: MailProps) => {
  const response = await apiClient.get(
    `/email/messages?page=${props.page}&limit=${props.limit}`,
    false,
  );
  console.log("getMails response:", response);
  return response.data as GmailDataResponse;
};
