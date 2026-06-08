import { apiClient } from "../apiclient";
import { TaskResponse } from "@/types/task";

export const getTask = async () => {
  const response = await apiClient.get("/tasks");
  return response.data as TaskResponse;
};
