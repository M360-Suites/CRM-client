"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import TaskCard from "./card";
import { useTask } from "@/hooks/tasks/get_tasks";
import AddTaskForm from "../form/add_task";
import { useState } from "react";

const ContactRowSkeleton = () => (
  <div className="w-full px-4 py-4 rounded-[8px] border border-border flex items-center justify-between animate-pulse">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="h-[40px] w-[40px] rounded-[6px] bg-gray-200" />
        <div className="flex flex-col gap-1">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-56 bg-gray-200 rounded" />
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded bg-gray-200" />
      <div className="h-5 w-5 rounded bg-gray-200" />
    </div>
  </div>
);

export default function Body() {
  const { data: tasks, isPending, isError, refetch } = useTask();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const tasksData = tasks?.data ?? [];

  return (
    <div className="w-full flex-col flex gap-8">
      <div className="w-full">
        {/* Loading state */}
        {isPending && (
          <div className="border border-[#F3D9C4] rounded-t-[12px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContactRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Contacts list */}
        {!isPending && !isError && tasks && tasksData.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-6">
              {tasksData.map((task, index) => (
                <TaskCard task={task} key={index} />
              ))}
            </div>
            {/* <div className="border border-t-0 border-[#F3D9C4] rounded-b-[12px] px-4 py-3">
              <CustomPagination
                page={page}
                totalPages={contacts.total_pages}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div> */}
          </>
        )}

        {/* Filtered empty state */}
        {!isPending && !isError && tasks?.data.length === 0 && (
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
              {(close) => (
                <AddTaskForm
                  onSuccess={() => {
                    close();
                  }}
                />
              )}
            </CustomDrawer>
          </div>
        )}
      </div>
    </div>
  );
}
