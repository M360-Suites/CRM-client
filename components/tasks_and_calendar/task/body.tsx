"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import TaskCard from "./card";
import { useTask } from "@/hooks/tasks/get_tasks";
import AddTaskForm from "../form/add_task";
import { useState } from "react";

const ContactRowSkeleton = () => (
  <div
    className="w-full px-4 py-4 rounded-[8px] border border-border flex items-center justify-between cursor-pointer hover:bg-[#F9F9F9] transition-colors animate-pulse"
    aria-hidden
  >
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        {/* date box */}
        <span className="block h-10 w-10 rounded-lg bg-gray-200" />
        <div className="flex flex-col gap-0.5">
          <span className="h-4 w-20 bg-gray-200 rounded" />
          <span className="h-3 w-12 bg-gray-200 rounded" />
        </div>
      </div>

      <div>
        <span className="h-4 w-28 bg-gray-200 rounded block" />
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
        {isPending && (
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContactRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Contacts list */}
        {!isPending && !isError && tasks && tasksData.length > 0 && (
          <>
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
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
