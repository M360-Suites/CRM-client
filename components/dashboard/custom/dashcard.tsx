"use client";
import { Users, TrendingUp, DollarSign, Building2 } from "lucide-react";
import { iconCardBg, iconColor, handleGreeting } from "@/lib/utils";
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
    },
    {
      title: "Revenue Forecast",
      value: dashboardData?.cards.revenue_forecast || 0,
      icon: DollarSign,
    },
    {
      title: "Active Contacts",
      value: dashboardData?.cards.active_contacts || 0,
      icon: Users,
    },
    {
      title: "Active Companies",
      value: dashboardData?.cards.active_companies || 0,
      icon: Building2,
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
      <div className="grid grid-cols-4 gap-5">
        {isPending
          ? // show skeletons while loading
            Array.from({ length: DashData.length }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : DashData.map((item) => (
              <div
                key={item.title}
                className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2"
              >
                <div className="w-64 flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-3 py-4">
                    <div
                      className={`rounded-full p-2 ${iconCardBg(item.title)}`}
                    >
                      <item.icon size={18} color={iconColor(item.title)} />
                    </div>
                    <span className="text-base font-medium text-foreground">
                      {item.title}
                    </span>
                  </div>
                  <div className="text-3xl text-foreground">{item.value}</div>
                </div>

                <div className="text-sm flex flex-row items-center gap-1">
                  <span>+8%</span>
                  <span>vs last 7 days</span>
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
          <div className="grid grid-cols-6 gap-4 w-full">
            {dashboardData?.pipeline_review.map((data) => (
              <div
                key={data.order}
                className="bg-[#FAFFFF] border border-[#E8E8E8] py-3.5 px-5 rounded-[12px]"
              >
                <div className="flex flex-col gap-2.5 w-42.5">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-normal text-foreground">
                      {data.name}
                    </span>
                    <span className="text-3xl font-semibold text-foreground">
                      {data.count}
                    </span>
                  </div>
                  <span className="text-xs font-normal text-foreground">
                    ${data.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col items-center">
          <span className="text-base font-medium">
            Total Pipeline Value: $31,700{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
