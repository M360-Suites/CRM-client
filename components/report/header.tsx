"use client";
import { TrendingUp, DollarSign, ChartPie, CircleX } from "lucide-react";
import { iconCardBg, iconColor, formatNaira } from "@/lib/utils";
import { useReportSummary } from "@/hooks/report/report_summary";

const CardSkeleton = () => (
  <div className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2 animate-pulse">
    <div className="flex flex-row items-center gap-3 py-2">
      <div className="rounded-full p-2 bg-gray-200 w-9 h-9" />
      <div className="h-4 w-32 bg-gray-200 rounded" />
    </div>
    <div className="h-10 w-28 bg-gray-200 rounded" />

    <div className="text-sm flex flex-row items-center gap-1">
      <div className="h-4 w-12 bg-gray-200 rounded" />
      <div className="h-4 w-28 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function Header() {
  const { data: summaryData, isPending } = useReportSummary();
  const reportCardData = [
    {
      title: "Total Deals",
      value: summaryData?.total_deals?.current ?? 0,
      icon: TrendingUp,
    },
    {
      title: "Open Deals",
      value: summaryData?.open_value
        ? formatNaira(summaryData.open_value.current)
        : "₦0",
      icon: DollarSign,
    },
    {
      title: "Won",
      value: summaryData?.won_value?.current
        ? formatNaira(summaryData.won_value.current)
        : "₦0",
      icon: ChartPie,
    },
    {
      title: "Lost",
      value: summaryData?.lost_value?.current
        ? formatNaira(summaryData.lost_value.current)
        : "₦0",
      icon: CircleX,
    },
  ];
  return (
    <div className="w-full pt-8 flex flex-col gap-10">
      <div className="flex flex-col gap-1 w-full">
        <h2 className="xl:text-2xl text-xl/[110%] font-medium text-[#3A2418]">
          Report
        </h2>
        <span className="xl:text-base text-sm font-medium text-foreground">
          Pipeline insights at a glance
        </span>
      </div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 gap-5">
        {isPending
          ? Array.from({ length: reportCardData.length }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : reportCardData.map((item) => (
              <div
                key={item.title}
                className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2"
              >
                <div className="flex flex-col gap-3 py-2">
                  <div className="flex flex-row items-center gap-2">
                    <div
                      className={`rounded-full p-2 ${iconCardBg(item.title)}`}
                    >
                      <item.icon size={16} color={iconColor(item.title)} />
                    </div>
                    <span className="text-base font-medium text-foreground">
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
