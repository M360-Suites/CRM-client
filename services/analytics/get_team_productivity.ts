import { apiClient } from "../apiclient";

export const getAnalyticTeamProductivity = async () => {
  const response = await apiClient.get("/analytics/team-productivity");
  return response;
};
