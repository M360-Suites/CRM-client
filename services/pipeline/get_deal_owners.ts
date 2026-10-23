import { apiClient } from "../apiclient";

type OwnerRef = string | { _id?: string; id?: string } | null | undefined;

interface DealWithOwner {
  _id?: string;
  id?: string;
  owner_id?: OwnerRef;
}

const ownerIdOf = (owner: OwnerRef) =>
  typeof owner === "string" ? owner : (owner?._id ?? owner?.id ?? null);

// The pipeline board doesn't include deal owners, so read them from /deals/all
export const GetDealOwners = async () => {
  const response = await apiClient.get<DealWithOwner[]>(`/deals/all`, true);
  const owners: Record<string, string | null> = {};
  for (const deal of response.data ?? []) {
    const dealId = deal._id ?? deal.id;
    if (dealId) owners[dealId] = ownerIdOf(deal.owner_id);
  }
  return owners;
};
