"use client";

import {
	Gauge,
	Plug,
	Route as RouteIcon,
	Sparkles,
	LibraryBig,
	Database,
	Coins,
	GitBranch,
	RefreshCw,
	type LucideIcon,
} from "lucide-react";

export const REVENUE_ENGINE_TABS = [
	{
		label: "CRO Dashboard",
		value: "overview",
		icon: Gauge,
		activeBg: "#E6F7F5",
		activeText: "#0F172A",
	},
	{
		label: "Ad Connectors",
		value: "connectors",
		icon: Plug,
		activeBg: "#E8F1FF",
		activeText: "#1D4ED8",
	},
	{
		label: "Attribution & ROI",
		value: "attribution",
		icon: GitBranch,
		activeBg: "#EAF7EC",
		activeText: "#166534",
	},
	{
		label: "Cost Intelligence",
		value: "cost",
		icon: Coins,
		activeBg: "#FFF4D6",
		activeText: "#9A6A14",
	},
	{
		label: "Instant Routing",
		value: "routing",
		icon: RouteIcon,
		activeBg: "#FDECEC",
		activeText: "#B91C1C",
	},
	{
		label: "AI Nurture",
		value: "nurture",
		icon: Sparkles,
		activeBg: "#FDF0E2",
		activeText: "#9A5B2E",
	},
	{
		label: "Template Library",
		value: "templates",
		icon: LibraryBig,
		activeBg: "#F2ECFF",
		activeText: "#5B4B9C",
	},
	{
		label: "Data Warehouse",
		value: "warehouse",
		icon: Database,
		activeBg: "#FEF3C7",
		activeText: "#92400E",
	},
] as const;

export type RevenueTabKey = (typeof REVENUE_ENGINE_TABS)[number]["value"];

export function Header({
	activeTab,
	setActiveTab,
	refreshing,
	onRefresh,
}: {
	activeTab: RevenueTabKey;
	setActiveTab: (value: RevenueTabKey) => void;
	refreshing: boolean;
	onRefresh: () => void;
}) {
	return (
		<div className="w-full">
			<div className="lg:mb-7 mb-4 flex items-center justify-between gap-3">
				<div className="flex flex-col gap-1 w-full">
					<h2 className="xl:text-2xl text-xl/[110%] font-medium text-[#3A2418]">
						Revenue Engine
					</h2>
					<span className="xl:text-base text-sm font-medium text-foreground">
						One module, eight linked layers — ad spend in,
						attributed revenue out.
					</span>
				</div>

				<button
					type="button"
					onClick={onRefresh}
					className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#374151] transition bg-white hover:bg-[#F3F4F6]"
				>
					<RefreshCw
						className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
					/>
					Refresh
				</button>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				{REVENUE_ENGINE_TABS.map((tab) => {
					const Icon = tab.icon as LucideIcon;
					const isActive = activeTab === tab.value;

					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => setActiveTab(tab.value)}
							className={[
								"flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 border hover:bg-[fcfcfc] hover:border-[#E6E6E6]",
								isActive
									? "shadow-none"
									: "text-[#5C6470] hover:text-[#1F2937]",
							].join(" ")}
							style={
								isActive
									? {
											backgroundColor: tab.activeBg,
											color: tab.activeText,
										}
									: undefined
							}
						>
							<Icon className="h-4 w-4" />
							<span>{tab.label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default Header;
