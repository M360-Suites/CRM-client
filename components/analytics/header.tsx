"use client";
import {
  Users,
  TrendingUp,
  DollarSign,
  Building2,
  CircleCheck,
  CircleCheckBigIcon,
  Clock,
} from "lucide-react";
import { iconCardBg, iconColor, formatNaira } from "@/lib/utils";
import { useAnalyticsSummary } from "@/hooks/analytics/analytics_summary";

const CardSkeleton = () => (
  <div className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2 animate-pulse">
    <div className="w-64 flex flex-col gap-3">
      <div className="flex flex-row items-center gap-3 py-4">
        <div className="rounded-full p-2 bg-gray-200 w-9 h-9" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
      <div className="h-10 w-28 bg-gray-200 rounded" />
    </div>

    <div className="text-sm flex flex-row items-center gap-1">
      <div className="h-4 w-12 bg-gray-200 rounded" />
      <div className="h-4 w-28 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function Header() {
  const { data: summaryData, isPending } = useAnalyticsSummary();
  const analyticsCardData = [
    {
      title: "Won Revenue",
      value: summaryData?.won_revenue
        ? formatNaira(summaryData.won_revenue)
        : "₦0",
      icon: DollarSign,
    },
    {
      title: "Pipeline Value",
      value: summaryData?.pipeline_value
        ? formatNaira(summaryData.pipeline_value)
        : "₦0",
      icon: TrendingUp,
    },
    {
      title: "Win Rate",
      value: summaryData?.win_rate ? `${summaryData.win_rate}%` : "0%",
      icon: CircleCheckBigIcon,
    },
    {
      title: "Avg. Cycle",
      value: summaryData?.average_cycle_days
        ? `${summaryData.average_cycle_days} days`
        : "0 days",
      icon: Clock,
    },
    {
      title: "Lead Conv.",
      value: summaryData?.lead_conversion_rate
        ? `${summaryData.lead_conversion_rate}%`
        : "0%",
      icon: Users,
    },
    {
      title: "Tasks",
      value: summaryData?.tasks_completed_last_30_days
        ? `${summaryData.tasks_completed_last_30_days}`
        : "0",
      icon: CircleCheck,
    },
  ];
  return (
    <div className="w-full pt-8 flex flex-col gap-10">
      <div className="flex flex-col gap-1 w-full">
        <h2 className="text-2xl font-medium text-[#3A2418]">Analytics Board</h2>
        <span className="text-base font-medium text-foreground">
          Performance, conversion and team productivity at a glance
        </span>
      </div>
      <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 gap-5">
        {isPending
          ? Array.from({ length: analyticsCardData.length }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : analyticsCardData.map((item) => (
              <div
                key={item.title}
                className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2"
              >
                <div className="flex flex-col gap-3 py-1">
                  <div className="flex flex-row items-center gap-2">
                    <div
                      className={`rounded-full p-1 ${iconCardBg(item.title)}`}
                    >
                      <item.icon size={14} color={iconColor(item.title)} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.title}{" "}
                      {item.title === "Tasks" && (
                        <span className="text-foreground/50 text-xs">
                          (30d)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-2xl text-foreground">{item.value}</div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
