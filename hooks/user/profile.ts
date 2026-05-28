"use client";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { getUser } from "@/services/user/profile";

export const useUserProfile = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};
