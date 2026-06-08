import { apiClient } from "../apiclient";
import { AddTaskRequestData } from "@/validation/task";

export const AddTask = async (data: AddTaskRequestData) => {
  const response = await apiClient.post("/tasks", data, true);
  return response;
};
