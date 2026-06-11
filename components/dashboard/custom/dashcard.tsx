"use client";
import { Users, TrendingUp, DollarSign, Building2 } from "lucide-react";
import {
  iconCardBg,
  iconColor,
  handleGreeting,
  formatNaira,
} from "@/lib/utils";
import { useUserProfile } from "@/hooks/user/profile";
import { useDashboard } from "@/hooks/user/dashboard";
import Link from "next/link";

export default function DashCard() {
  const { data: user } = useUserProfile();
  const { data: dashboardData, isPending } = useDashboard();
  const firstname = user?.display_name?.split(" ")[0];

  const DashData = [
    {
      title: "Open Deals",
      value: dashboardData?.cards.open_deals || 0,
      icon: TrendingUp,
      change: dashboardData?.card_progress.open_deals.change || 0,
      current: dashboardData?.card_progress.open_deals.current || 0,
      previous: dashboardData?.card_progress.open_deals.previous || 0,
      percentage: dashboardData?.card_progress.open_deals.percent_change || 0,
    },
    {
      title: "Revenue",
      value: formatNaira(dashboardData?.cards.revenue_forecast) || 0,
      icon: DollarSign,
      change: dashboardData?.card_progress.revenue_forecast.change || 0,
      current: dashboardData?.card_progress.revenue_forecast.current || 0,
      previous: dashboardData?.card_progress.revenue_forecast.previous || 0,
      percentage:
        dashboardData?.card_progress.revenue_forecast.percent_change || 0,
    },
    {
      title: "Contacts",
      value: dashboardData?.cards.active_contacts || 0,
      icon: Users,
      change: dashboardData?.card_progress.active_contacts.change || 0,
      current: dashboardData?.card_progress.active_contacts.current || 0,
      previous: dashboardData?.card_progress.active_contacts.previous || 0,
      percentage:
        dashboardData?.card_progress.active_contacts.percent_change || 0,
    },
    {
      title: "Companies",
      value: dashboardData?.cards.active_companies || 0,
      icon: Building2,
      change: dashboardData?.card_progress.active_companies.change || 0,
      current: dashboardData?.card_progress.active_companies.current || 0,
      previous: dashboardData?.card_progress.active_companies.previous || 0,
      percentage:
        dashboardData?.card_progress.active_companies.percent_change || 0,
    },
  ];

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

  const PipelineSkeleton = () => (
    <div className="grid grid-cols-6 gap-4 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#FAFFFF] border border-[#E8E8E8] py-3.5 px-5 rounded-[12px] animate-pulse"
        >
          <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-20 bg-gray-200 rounded mb-1" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );

  console.log("dashboardData", dashboardData);

  return (
    <div className="flex flex-col gap-6 pt-8">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-2xl font-medium text-foreground capitalize">
          {handleGreeting()}, {firstname}
        </h2>
        <span className="text-base font-normal">
          Here&apos;s how your pipeline looks today.
        </span>
      </div>
      <div className="grid xl:grid-cols-4 grid-cols-2 gap-5">
        {isPending
          ? // show skeletons while loading
            Array.from({ length: DashData.length }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : DashData.map((item) => (
              <div
                key={item.title}
                className="xl:p-4 lg:p-3 p-2 border border-[#E8E8E8] overflow-hidden rounded-[8px] flex flex-col gap-2"
              >
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-3 xl:py-4 py-2">
                    <div
                      className={`rounded-full p-2 ${iconCardBg(item.title)}`}
                    >
                      <item.icon
                        className="xl:size-4.5 size-4"
                        color={iconColor(item.title)}
                      />
                    </div>
                    <span className="xl:text-base text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                  </div>
                  <div className="xl:text-3xl text-2xl text-foreground">
                    {item.value}
                  </div>
                </div>

                <div className="xl:text-sm text-xs flex flex-row items-center gap-1">
                  <span>+{item.percentage}%</span>
                  <span>vs {item.percentage} days</span>
                </div>
              </div>
            ))}
      </div>
      <div className="py-6 px-5 border border-[#E8E8E8] rounded-lg flex flex-col gap-4">
        <div className="flex w-full justify-between items-center">
          <span>Pipeline Preview</span>
          <Link
            href="/pipeline"
            className="text-sm text-[#FF9E55] hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        {isPending ? (
          <PipelineSkeleton />
        ) : (
          <div className="grid xl:grid-cols-6  md:grid-cols-3 grid-cols-2 gap-4 w-full">
            {dashboardData?.pipeline_review.map((data) => (
              <div
                key={data.order}
                className="bg-[#FAFFFF] overflow-hidden border border-[#E8E8E8] py-3.5 xl:px-5 px-2 rounded-[12px]"
              >
                <div className="flex flex-col gap-2.5 w-full overflow-hidden">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-normal text-foreground">
                      {data.name}
                    </h3>
                    <h2 className="text-3xl self-auto font-semibold text-foreground">
                      {data.count}
                    </h2>
                  </div>
                  <span className="text-xs font-normal text-foreground">
                    {formatNaira(data.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col items-center">
          <span className="xl:text-base text-sm font-medium">
            Total Pipeline Value:{" "}
            {formatNaira(dashboardData?.pipeline_total.value || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
