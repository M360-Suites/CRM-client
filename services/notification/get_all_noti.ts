import { apiClient } from "../apiclient";
import { NotificationResponse } from "@/types/noties";

export default async function GetAllNotifications() {
  const response = await apiClient.get("/notifications");
  return response.data as NotificationResponse;
}
