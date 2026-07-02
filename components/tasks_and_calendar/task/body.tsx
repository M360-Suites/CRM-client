"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import TaskCard from "./card";
import { useTask } from "@/hooks/tasks/get_tasks";
import AddTaskForm from "../form/add_task";

const CardSkeleton = () => (
  <div
    className="w-full px-4 py-4 rounded-[8px] border border-border flex items-center justify-between animate-pulse"
    aria-hidden
  >
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="block h-10 w-10 rounded-lg bg-gray-200" />
        <div className="flex flex-col gap-0.5">
          <span className="h-4 w-20 bg-gray-200 rounded block" />
          <span className="h-3 w-12 bg-gray-200 rounded block" />
        </div>
      </div>
      <span className="h-4 w-28 bg-gray-200 rounded block" />
    </div>
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded bg-gray-200" />
      <div className="h-5 w-5 rounded bg-gray-200" />
    </div>
  </div>
);

export default function Body() {
  const { data: tasks, isPending, isError } = useTask();
  const tasksData = tasks?.data ?? [];

  return (
    <div className="w-full flex-col flex gap-8">
      <div className="w-full">
        {isPending && (
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isPending && !isError && tasksData.length > 0 && (
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
            {tasksData.map((task) => (
              <TaskCard task={task} key={task._id} />
            ))}
          </div>
        )}

        {!isPending && !isError && tasksData.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              No Task yet
            </span>
            <CustomDrawer
              label="Add Task"
              trigger={
                <CustomButton
                  variant="default"
                  className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
                >
                  <span>Add your first task</span>
                </CustomButton>
              }
            >
              {(close) => <AddTaskForm onSuccess={close} />}
            </CustomDrawer>
          </div>
        )}
      </div>
    </div>
  );
}
