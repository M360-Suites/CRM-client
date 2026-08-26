"use client";
import { useQuery } from "@tanstack/react-query";
import getNotification from "@/services/notification/get_all_noti";
import { NotificationResponse } from "@/types/noties";

export const useGetAllNotifications = () => {
  return useQuery<NotificationResponse>({
    queryKey: ["notifications"],
    queryFn: getNotification,
    refetchInterval: 20 * 60 * 1000,
  });
};
