import { useQuery } from "@tanstack/react-query";
import {getInvitedStaffs} from "@/services/user/admin/invited_staffs";
import { UserInvitationResponse } from "@/types/user";

export const useGetInvitations = () => {
  return useQuery<UserInvitationResponse[]>({
    queryKey: ["invitations"],
    queryFn: getInvitedStaffs,
    refetchInterval: 1 * 60 * 1000,
  });
};
