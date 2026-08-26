import { apiClient } from "../apiclient";

export default async function MarkNotificationById(id: string) {
  const response = await apiClient.patch(`/notifications/${id}/read`, {});
  return response;
}
