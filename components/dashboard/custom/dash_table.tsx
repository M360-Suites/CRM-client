"use client";

import { getInitials } from "@/lib/utils";
import { MoreVerticalIcon } from "lucide-react";
import { useDashboard } from "@/hooks/user/dashboard";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { CustomButton } from "@/components/custom/common/customButton";
import { PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddContactForm from "@/components/contacts/forms/add_contact";
import PipelineByStage from "@/components/analytics/analytics_card/pipeline_by_stage_copy";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomSelect as AnalyticsSelect } from "@/components/custom/common/custom_analytics_select";
import { useAnalyticsPipelineStage } from "@/hooks/analytics/analytics_pipeline_stage";
import { useTask } from "@/hooks/tasks/get_tasks";
import { useUserStore } from "@/stores/user/user_store";
import { toUTC } from "@/lib/utils";
import Link from "next/link";

interface AnalyticsSummaryProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

const DashRowSkeleton = () => (
  <div className="grid grid-cols-3 xl:gap-10 py-4 px-4 border-b border-[#E8E8E8] animate-pulse">
    <div className="flex items-center space-x-4 col-span-2">
      <div className="h-9 w-9 rounded-full bg-gray-200" />
      <div className="h-3.5 w-28 bg-gray-200 rounded-full" />
    </div>
    <div className="flex justify-between items-center gap-4">
      <div className="h-3.5 w-20 bg-gray-200 rounded-full" />
      <div className="h-4 w-4 bg-gray-200 rounded-full" />
    </div>
  </div>
);

export default function DashTable() {
  const { pipelineStateTimeframe, setPipelineStateTimeframe } = useUserStore();
  const { data: pipelineStageData, isLoading: isPipelineStageLoading } =
    useAnalyticsPipelineStage({ timeframe: pipelineStateTimeframe });

  const {
    data: tasks,
    isPending: isTaskPending,
    isError: isTaskError,
  } = useTask();

  const priorityColor: Record<string, string> = {
    high: "bg-[#FDE2E2] text-[#C93B3B]",
    medium: "bg-[#FFF3D6] text-[#B8860B]",
    low: "bg-[#E2F5E9] text-[#2F9E67]",
  };

  const now = new Date();

  const upcomingTasks = (tasks?.data ?? [])
    .filter((task) => task.due_at && new Date(task.due_at) >= now)
    .filter((task) => task.status !== "completed") // adjust if your status enum differs
    .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())
    .slice(0, 5);

  const { data: dashboard, isPending, isError } = useDashboard();

  const handlePipelineStateframeChange = (
    timeframe: AnalyticsSummaryProps["timeframe"],
  ) => {
    setPipelineStateTimeframe(timeframe);
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
      <div className="p-4 border border-[#E8E8E8] bg-white rounded-lg flex flex-col gap-2 w-full">
        <div className="w-full flex items-start   flex-row justify-between">
          <h2 className="md:text-sm text-xs font-medium text-foreground">
            Pipeline Revenue
          </h2>
          <div>
            <AnalyticsSelect
              selectable={[
                { value: " ", name: "---" },
                { value: "daily", name: "Daily" },
                { value: "weekly", name: "Weekly" },
                { value: "monthly", name: "Monthly" },
              ]}
              placeholder="pick time frame"
              value={pipelineStateTimeframe}
              onChange={(timeframe) =>
                handlePipelineStateframeChange(
                  timeframe as AnalyticsSummaryProps["timeframe"],
                )
              }
            />
          </div>
        </div>
        <div className="flex justify-center items-center h-full">
          {isPipelineStageLoading ? (
            <div className="w-full h-64 animate-pulse bg-[#E8E8E8]/50 rounded-[8px]" />
          ) : pipelineStageData?.length === 0 ? (
            <p className="text-sm text-foreground">
              No pipeline stage data yet
            </p>
          ) : (
            <PipelineByStage />
          )}
        </div>
      </div>
      <div className="border border-[#E8E8E8] bg-white rounded-lg h-full w-full">
        <div className="flex w-full justify-between items-center py-3.5 px-4">
          <span className="text-foreground font-medium text-sm">
            Recent Contacts
          </span>
          <Link
            href="/contacts"
            className="text-sm text-[#0041FF] hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        <div className="">
          {isPending ? (
            Array.from({ length: 4 }).map((_, i) => <DashRowSkeleton key={i} />)
          ) : isError ? (
            <div className="py-8 px-6 flex flex-col items-center justify-center gap-3 text-center">
              <span className="text-sm font-medium text-foreground">
                Something went wrong
              </span>
              <p className="text-xs text-muted-foreground max-w-xs">
                We couldn&apos;t load your recent contacts. Please try again.
              </p>
            </div>
          ) : dashboard?.recent_contacts &&
            dashboard.recent_contacts.length > 0 ? (
            dashboard.recent_contacts.map((data) => (
              <div
                key={data.id}
                className="flex flex-row items-center justify-between pb-3.5 pt-4 px-4 border-b border-[#E8E8E8] last:border-b-0"
              >
                <div className="flex items-center lg:space-x-3 space-x-2 col-span-2">
                  <div className="p-[7px] rounded-full bg-[#D8F3F1] text-[#2F9E94] text-sm font-semibold">
                    {getInitials(data.full_name)}
                  </div>
                  <span className="block text-sm text-foreground capitalize">
                    {data.full_name}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-xs text-start self-center truncate text-foreground">
                    {toUTC(data.created_at)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 px-6 flex flex-col items-center justify-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">
                No recent contacts
              </span>
              <p className="text-xs text-muted-foreground max-w-xs">
                You don&apos;t have any recent contacts yet. Add a contact or
                view all contacts to get started.
              </p>
              <CustomDrawer
                label="Add Contacts"
                trigger={
                  <CustomButton
                    variant="default"
                    className="rounded-full flex flex-row items-center max-md:hidden gap-2 md:px-5 max-md:px-4 py-2.5"
                  >
                    <PlusIcon className="" />
                    <span>Add Contact</span>
                  </CustomButton>
                }
              >
                {(close: () => void) => (
                  <AddContactForm
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

      <div className="border border-[#E8E8E8] bg-white rounded-lg min-h-90 w-full">
        <div className="flex w-full justify-between items-center py-3.5 px-4">
          <span className="text-foreground font-medium text-sm">
            Upcoming Tasks
          </span>
          <Link
            href="/tasks"
            className="text-sm text-[#0041FF] hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        <div className="">
          {isTaskPending ? (
            Array.from({ length: 4 }).map((_, i) => <DashRowSkeleton key={i} />)
          ) : isTaskError ? (
            <div className="py-8 px-6 flex flex-col items-center justify-center gap-3 text-center">
              <span className="text-sm font-medium text-foreground">
                Something went wrong
              </span>
              <p className="text-xs text-muted-foreground max-w-xs">
                We couldn&apos;t load your upcoming tasks. Please try again.
              </p>
            </div>
          ) : upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-row items-center justify-between pb-3.5 pt-4 px-4 border-b border-[#E8E8E8] last:border-b-0"
              >
                <div className="flex items-center lg:space-x-3 space-x-2 col-span-2 min-w-0">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize shrink-0 ${
                      priorityColor[task.priority] ??
                      "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="block text-sm text-foreground truncate">
                    {task.title}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4 shrink-0">
                  <span className="text-xs text-start self-center truncate text-foreground">
                    {task.due_at ? toUTC(task.due_at) : "No due date"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 px-6 flex flex-col items-center justify-center h-full gap-2.5 text-center">
              <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">
                No upcoming tasks
              </span>
              <p className="text-xs text-muted-foreground max-w-xs">
                You don&apos;t have any upcoming tasks yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
