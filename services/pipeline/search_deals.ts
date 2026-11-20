import { apiClient } from "../apiclient";

// GET /deals returns the full Deal model, keyed by `_id`
export interface SearchedDeal {
  _id?: string;
  id?: string;
  title: string;
}

export const searchDeals = async (search: string, limit = 100) => {
  const response = await apiClient.get<
    SearchedDeal[] | { deals?: SearchedDeal[]; data?: SearchedDeal[] }
  >("deals", true, { search, limit });
  if (!response.status) throw new Error(response.message);
  // The list is paginated; accept either a bare array or a wrapped one
  const data = response.data;
  if (Array.isArray(data)) return data;
  return data?.deals ?? data?.data ?? [];
};
