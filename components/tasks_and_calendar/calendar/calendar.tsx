"use client";

import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import type { View, ToolbarProps, EventPropGetter } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useMemo } from "react";
import { PlusIcon, ChevronLeft, ChevronRight } from "lucide-react";
import TaskCard from "@/components/tasks_and_calendar/task/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddTaskForm from "@/components/tasks_and_calendar/form/add_task";
import { useTask } from "@/hooks/tasks/get_tasks";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

const localizer = momentLocalizer(moment);

// ─── calendar event type ──────────────────────────────────────────────────────

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

function taskToEvent(task: Task): CalendarEvent {
  const start = new Date(task.due_at);
  const durationMs = (task.duration_minutes ?? 30) * 60_000;
  return {
    id: task._id,
    title: task.title,
    start,
    end: new Date(start.getTime() + durationMs),
    resource: task,
  };
}

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  high: "#E2725B",
  medium: "#F59E42",
  low: "#4A9D8F",
};

const STATUS_OPACITY: Record<Task["status"], number> = {
  completed: 0.45,
  in_progress: 0.8,
  pending: 1,
};

const VIEW_LABELS: Record<string, string> = {
  month: "Month",
  week: "Week",
  day: "Day",
  agenda: "Agenda",
};

// ─── custom toolbar ───────────────────────────────────────────────────────────

function CalendarToolbar({
  label,
  view,
  views,
  onNavigate,
  onView,
}: ToolbarProps<CalendarEvent>) {
  const viewList = Array.isArray(views)
    ? views
    : (Object.keys(views) as View[]);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-[#F3D9C4]">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onNavigate("TODAY")}
          className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#F3D9C4] hover:bg-[#F5B7A3]/20 transition-colors text-foreground"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate("PREV")}
          className="p-1.5 rounded-full hover:bg-[#F5B7A3]/30 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="p-1.5 rounded-full hover:bg-[#F5B7A3]/30 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
        <span className="text-sm font-medium text-foreground ml-1 whitespace-nowrap">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-1 border border-[#F3D9C4] rounded-full py-1 px-1">
        {viewList.map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              v === view
                ? "bg-[#E2725B] text-white"
                : "text-foreground hover:bg-[#F5B7A3]/30",
            )}
          >
            {VIEW_LABELS[v] ?? v}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── date grouping helpers ────────────────────────────────────────────────────

function toDateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayKey() {
  return toDateKey(new Date().toISOString());
}

function formatDayHeader(iso: string): { day: string; dayName: string } {
  const d = new Date(iso);
  return {
    day: String(d.getDate()),
    dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
  };
}

// ─── single date group ────────────────────────────────────────────────────────

function DateGroup({ dateKey, tasks }: { dateKey: string; tasks: Task[] }) {
  const isoForHeader = tasks[0]?.due_at ?? `${dateKey}T00:00:00`;
  const { day, dayName } = formatDayHeader(isoForHeader);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-foreground">{day}</span>
          <span className="text-sm font-medium text-muted-foreground">
            {dayName}
          </span>
        </div>
        <CustomDrawer
          label="Add Task"
          trigger={
            <CustomButton
              variant="default"
              className="rounded-full flex flex-row items-center gap-3 xl:px-8 px-6 max-md:py-3.5 py-2.5"
            >
              <PlusIcon />
              <span className="max-md:text-sm">New</span>
            </CustomButton>
          }
        >
          {(close) => <AddTaskForm onSuccess={close} />}
        </CustomDrawer>
      </div>

      {tasks.length === 0 ? (
        <div className="w-full border border-[#E8E8E8] rounded-[12px] py-10 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">No task yet</span>
        </div>
      ) : (
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function CalendarSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3D9C4]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-7 w-48 rounded-full" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-7 rounded" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={`c${i}`} className="h-20 rounded" />
        ))}
      </div>
    </div>
  );
}

// ─── views config ─────────────────────────────────────────────────────────────

const DESKTOP_VIEWS: View[] = [
  Views.MONTH,
  Views.WEEK,
  Views.DAY,
  Views.AGENDA,
];
const MOBILE_VIEWS: View[] = [Views.MONTH, Views.AGENDA];

// ─── main ─────────────────────────────────────────────────────────────────────

export default function CalendarView() {
  const isMobile = useIsMobile();
  const { data: tasks, isPending } = useTask();

  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const availableViews = isMobile ? MOBILE_VIEWS : DESKTOP_VIEWS;
  const activeView: View = availableViews.includes(view) ? view : Views.MONTH;

  const events = useMemo<CalendarEvent[]>(
    () => (tasks?.data ?? []).map(taskToEvent),
    [tasks],
  );

  // Only show today's group below the calendar
  const today = todayKey();
  const todayTasks = useMemo(
    () => (tasks?.data ?? []).filter((t) => toDateKey(t.due_at) === today),
    [tasks, today],
  );

  const eventPropGetter: EventPropGetter<CalendarEvent> = (event) => ({
    style: {
      backgroundColor: PRIORITY_COLORS[event.resource?.priority] ?? "#E2725B",
      opacity: STATUS_OPACITY[event.resource?.status] ?? 1,
      borderRadius: "6px",
      border: "none",
      color: "#fff",
      fontSize: "0.7rem",
      padding: "1px 4px",
    },
  });

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Big calendar */}
      {isPending ? (
        <CalendarSkeleton />
      ) : (
        <div className="rbc-wrapper w-full">
          <BigCalendar<CalendarEvent>
            localizer={localizer}
            events={events}
            view={activeView}
            date={date}
            onView={setView}
            onNavigate={setDate}
            views={availableViews}
            eventPropGetter={eventPropGetter}
            style={{ height: isMobile ? 480 : 680 }}
            components={{ toolbar: CalendarToolbar }}
            popup
            showMultiDayTimes
          />
        </div>
      )}

      {/* Today's tasks below the calendar */}
      <DateGroup dateKey={today} tasks={todayTasks} />
    </div>
  );
}
