import { Task } from "@/types/task";
import { parseDateWithTime } from "@/lib/handler";
import { EyeIcon, PencilIcon } from "lucide-react";

export default function TaskCard({ task }: { task: Task }) {
  const { date, month, time } = parseDateWithTime(task.due_at);
  return (
    <div className="w-full px-4 py-4 rounded-[8px] border border-border flex items-center justify-between cursor-pointer hover:bg-[#F9F9F9] transition-colors">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[40px] font-medium tracking-[1px]">{date}</span>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm/[100%] font-medium capitalize">
              {month}
            </span>
            <span className="text-[10px] font-medium">{time}</span>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium">{task.title}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <EyeIcon className="size-5 text-[#E2725B]" />
        <PencilIcon className="size-5 text-[#E2725B]" />
      </div>
    </div>
  );
}
