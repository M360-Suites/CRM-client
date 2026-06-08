"use client";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "@/services/task/get_tasks";
import { TaskResponse } from "@/types/task";

export const useTask = () => {
  return useQuery<TaskResponse>({
    queryKey: ["tasks"],
    queryFn: getTask,
    refetchInterval: 20 * 60 * 1000,
  });
};
