import { apiClient } from "@/services/apiclient";
import { ApiResponse } from "@/types/common";

interface KeyResponse {
  publicKey: string;
  privateKey: string;
}

export const generatePublicKey = async () => {
  const response = await apiClient.post(
    "/org/api-keys/regenerate-public",
    {},
    true,
  );
  return response as ApiResponse<Partial<KeyResponse>>;
};

export const revokePublicKey = async (type: string) => {
  const response = await apiClient.post(
    "/org/api-keys/revoke",
    {
      type,
    },
    true,
  );
  return response as ApiResponse<KeyResponse>;
};

export const getAvailableKeys = async () => {
  const response = await apiClient.get("/org/api-keys", true);
  return response as ApiResponse<KeyResponse>;
};
