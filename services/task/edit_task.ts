import { apiClient } from "../apiclient";
import { AddTaskRequestData } from "@/validation/task";

export const EditTask = async (
  data: Partial<AddTaskRequestData> & { _id: string },
) => {
  const { _id, ...rest } = data;
  const response = await apiClient.patch(`/tasks/${_id}`, rest, true);
  return response;
};
