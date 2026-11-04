import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DeactivateStaff,
  ReactivateStaff,
} from "@/services/user/admin/deactivate_staff";
import { toast } from "sonner";

export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeactivateStaff(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Staff member deactivated");
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to deactivate staff member");
    },
  });
};

export const useReactivateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReactivateStaff(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Staff member reactivated");
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to reactivate staff member");
    },
  });
};
