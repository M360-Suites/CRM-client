import { apiClient } from "../apiclient";
import { AssignmentMode } from "@/types/pipeline";

export const GetAssignmentSettings = async () => {
  const response = await apiClient.get<{ assignment_mode: AssignmentMode }>(
    `/org/assignment-settings`,
    true,
  );
  if (!response.status || !response.data) throw new Error(response.message);
  return response.data.assignment_mode;
};

export const updateAssignmentSettings = async (
  assignment_mode: AssignmentMode,
) => {
  const response = await apiClient.patch(
    `/org/assignment-settings`,
    { assignment_mode },
    true,
  );
  return response;
};
