import { useQuery } from "@tanstack/react-query";
import { getInvitedStaffs } from "@/services/user/admin/invited_staffs";
import { UserInvitationResponse } from "@/types/user";

export const useGetInvitations = (enabled = true) => {
  return useQuery<UserInvitationResponse[]>({
    queryKey: ["invitations"],
    queryFn: getInvitedStaffs,
    enabled,
    // Reuse cached data when switching settings tabs; mutations invalidate it
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
