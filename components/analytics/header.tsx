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
import { iconCardBg, iconColor } from "@/lib/utils";
import Link from "next/link";

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
  const isPending = false;
  const analyticsCardData = [
    {
      title: "Won Revenue",
      value: "₦125000",
      icon: DollarSign,
    },
    {
      title: "Pipeline Value",
      value: "₦100000",
      icon: TrendingUp,
    },
    {
      title: "Win Rate",
      value: "25%",
      icon: CircleCheckBigIcon,
    },
    {
      title: "Avg. Cycle",
      value: 30,
      icon: Clock,
    },
    {
      title: "Lead Conv.",
      value: "25%",
      icon: Users,
    },
    {
      title: "Tasks",
      value: "15",
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
      <div className="grid grid-cols-6 gap-5">
        {isPending
          ? // show skeletons while loading
            Array.from({ length: analyticsCardData.length }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : analyticsCardData.map((item) => (
              <div
                key={item.title}
                className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2"
              >
                <div className="flex flex-col gap-3">
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
                  <div className="text-3xl text-foreground">{item.value}</div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
