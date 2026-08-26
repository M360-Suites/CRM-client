import { apiClient } from "../apiclient";

export default async function MarkAllNotifications() {
  const response = await apiClient.patch("/notifications/read-all", {});
  return response;
}
