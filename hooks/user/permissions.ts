"use client";
import { useUserProfile } from "@/hooks/user/profile";

const DEAL_ASSIGNMENT_ROLES = ["admin", "sales_manager"];

export const useCanManageDealAssignment = () => {
  const { data: user } = useUserProfile();
  return DEAL_ASSIGNMENT_ROLES.includes(user?.role ?? "");
};

export const useCanChangeAssignmentMode = () => {
  const { data: user } = useUserProfile();
  return user?.role === "admin";
};
