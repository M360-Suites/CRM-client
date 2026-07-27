"use client";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/user/profile";

export const useUserProfile = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
    refetchInterval: 2 * 60 * 100,
  });
};
