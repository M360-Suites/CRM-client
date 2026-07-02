"use client";

import { useTasksAndCalendarStore } from "@/stores/tasks_calendars/task_calendare_store";
import Body from "@/components/tasks_and_calendar/task/body";
import CalendarView from "./calendar/calendar";

export default function MainBody() {
  const { activeTab } = useTasksAndCalendarStore();

  return (
    <div className="w-full rounded-lg flex items-center justify-center">
      {activeTab === "list" ? <Body /> : <CalendarView />}
    </div>
  );
}
