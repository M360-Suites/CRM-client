import { useQuery } from "@tanstack/react-query";
import { GetStaffs } from "@/services/user/admin/get_staffs";
import { StaffResponse } from "@/types/user";

export const useGetStaffs = () => {
  return useQuery<StaffResponse>({
    queryKey: ["staff"],
    queryFn: GetStaffs,
    refetchInterval: 1 * 60 * 1000,
  });
};
