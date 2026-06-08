"use client";

import { useTasksAndCalendarStore } from "@/stores/tasks_calendars/task_calendare_store";
import Body from "@/components/tasks_and_calendar/task/body";

export default function MainBody() {
  const { activeTab } = useTasksAndCalendarStore();

  return (
    <div className="w-full rounded-lg flex items-center justify-center">
      {activeTab === "list" ? (
        <Body />
      ) : (
        <div className="flex flex-col w-full items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
          <span className="text-base font-normal text-foreground">
            Calendar view is coming soon!
          </span>
        </div>
      )}
    </div>
  );
}
