import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAvailableKeys,
  generatePublicKey,
  revokePublicKey,
} from "@/services/user/key_generation";
import { toast } from "sonner";
import { ApiResponse } from "@/types/common";

interface KeyResponse {
  publicKey: string;
  privateKey: string;
}

export const useGeneratePublicKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generatePublicKey,
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["available-keys"] });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to generate public key");
    },
  });
};

export const useRevokePublicKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokePublicKey,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["available-keys"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to revoke public key");
    },
  });
};

export const useGetAvailableKeys = () => {
  return useQuery<ApiResponse<KeyResponse>>({
    queryKey: ["available-keys"],
    queryFn: getAvailableKeys,
    refetchInterval: 2 * 60 * 100,
  });
};
