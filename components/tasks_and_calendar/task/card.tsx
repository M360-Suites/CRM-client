"use client";

import { Task } from "@/types/task";
import { parseDateWithTime } from "@/lib/handler";
import { EyeIcon, PencilIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddTaskForm from "../form/add_task";

export default function TaskCard({ task }: { task: Task }) {
  const { date, month, time } = parseDateWithTime(task.due_at);

  return (
    <div className="w-full px-4 py-4 rounded-[8px] border border-border bg-white flex items-center justify-between hover:bg-[#FFFAF7] transition-colors">
      {/* Date + title */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[32px] leading-none font-medium text-foreground">
            {date}
          </span>
          <div className="flex flex-col gap-0">
            <span className="text-xs font-medium capitalize leading-tight">
              {month}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight">
              {time}
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-foreground truncate">
          {task.title}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <EyeIcon className="size-5 text-[#E2725B] cursor-pointer" />
        <CustomDrawer
          label="Edit Task"
          trigger={
            <PencilIcon className="size-5 text-[#E2725B] cursor-pointer" />
          }
        >
          {(close) => <AddTaskForm task={task} onSuccess={close} />}
        </CustomDrawer>
      </div>
    </div>
  );
}
