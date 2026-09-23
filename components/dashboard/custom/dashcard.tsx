"use client";
import {
	Users,
	TrendingUp,
	TrendingDown,
	DollarSign,
	Building2,
} from "lucide-react";
import {
	iconCardBg,
	iconColor,
	handleGreeting,
	formatNaira,
} from "@/lib/utils";
import { useUserProfile } from "@/hooks/user/profile";
import { useDashboard } from "@/hooks/user/dashboard";
import Link from "next/link";

const CardSkeleton = () => (
	<div className="p-3 border border-[#E8E8E8] bg-white rounded-[8px] flex flex-col gap-2 animate-pulse">
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
			percentage:
				dashboardData?.card_progress.open_deals.percent_change || 0,
		},
		{
			title: "Revenue",
			value: formatNaira(dashboardData?.cards.revenue_forecast) || 0,
			icon: DollarSign,
			change: dashboardData?.card_progress.revenue_forecast.change || 0,
			current: dashboardData?.card_progress.revenue_forecast.current || 0,
			previous:
				dashboardData?.card_progress.revenue_forecast.previous || 0,
			percentage:
				dashboardData?.card_progress.revenue_forecast.percent_change ||
				0,
		},
		{
			title: "Contacts",
			value: dashboardData?.cards.active_contacts || 0,
			icon: Users,
			change: dashboardData?.card_progress.active_contacts.change || 0,
			current: dashboardData?.card_progress.active_contacts.current || 0,
			previous:
				dashboardData?.card_progress.active_contacts.previous || 0,
			percentage:
				dashboardData?.card_progress.active_contacts.percent_change ||
				0,
		},
		{
			title: "Companies",
			value: dashboardData?.cards.active_companies || 0,
			icon: Building2,
			change: dashboardData?.card_progress.active_companies.change || 0,
			current: dashboardData?.card_progress.active_companies.current || 0,
			previous:
				dashboardData?.card_progress.active_companies.previous || 0,
			percentage:
				dashboardData?.card_progress.active_companies.percent_change ||
				0,
		},
	];

	return (
		<div className="flex flex-col gap-6 pt-8">
			<div className="flex flex-col gap-1">
				<h2 className="md:text-lg/[110%] text-base/[100%] font-medium text-foreground capitalize">
					{handleGreeting()}, {firstname}👋
				</h2>
				<span className="lg:text-base text-sm font-normal">
					Here&apos;s how your pipeline looks today.
				</span>
			</div>
			<div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 overflow-hidden">
				{isPending
					? // show skeletons while loading
						Array.from({ length: DashData.length }).map((_, i) => (
							<CardSkeleton key={i} />
						))
					: DashData.map((item) => (
							<div
								key={item.title}
								className="lg:px-4 lg:py-2.5 px-3 py-1.5 border border-[#E8E8E8] bg-white overflow-hidden rounded-xl hover:shadow-sm flex flex-col gap-2"
							>
								<div className="w-full flex flex-col gap-3">
									<div className="flex flex-row items-center gap-3 xl:py-2 py-2">
										<div
											className={`rounded-full p-2 ${iconCardBg(item.title)}`}
										>
											<item.icon
												className="xl:size-4 size-3.5"
												color={iconColor(item.title)}
											/>
										</div>
										<span className="lg:text-base text-xs font-semibold text-foreground">
											{item.title}
										</span>
									</div>
									<div className="xl:text-2xl text-xl font-medium text-foreground">
										{item.value}
									</div>
								</div>

								<div className="xl:text-sm text-xs flex flex-row items-center gap-1">
									{item.percentage >= 0 ? (
										<TrendingUp className="size-3.5 text-green-600 shrink-0" />
									) : (
										<TrendingDown className="size-3.5 text-red-500 shrink-0" />
									)}
									<span
										className={
											item.percentage >= 0
												? "text-green-600 font-medium text-sm"
												: "text-red-500 font-medium text-sm"
										}
									>
										{item.percentage >= 0 ? "+" : ""}
										{item.percentage}%
									</span>
									<span className="text-muted-foreground">
										vs last period
									</span>
								</div>
							</div>
						))}
			</div>
		</div>
	);
}
