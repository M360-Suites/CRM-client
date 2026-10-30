"use client";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/user/profile";

export const useUserProfile = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
    // Fetch once per session; logout removes it so the next login refetches
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
