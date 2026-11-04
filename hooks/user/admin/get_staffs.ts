import { useQuery } from "@tanstack/react-query";
import { GetStaffs } from "@/services/user/admin/get_staffs";
import { StaffResponse } from "@/types/user";

export const useGetStaffs = (enabled = true) => {
  return useQuery<StaffResponse>({
    queryKey: ["staff"],
    queryFn: GetStaffs,
    enabled,
    // Reuse cached data when switching settings tabs; mutations invalidate it
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
