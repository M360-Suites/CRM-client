"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Profile from "./profile/page";
import RolesAccess from "./roles/page";
import Staffs from "./staffs/page";
import LeadCaptureSettings from "./lead/page";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const Tabs = [
	{ name: "Profile", value: "profile", component: Profile },
	{ name: "Roles & Permissions", value: "roles", component: RolesAccess },
	{ name: "Staffs", value: "staffs", component: Staffs },
	{ name: "Connector", value: "connector", component: LeadCaptureSettings },
];

export default function Body() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const tab = searchParams.get("tab") ?? "profile";
	const activeTab = Tabs.find((t) => t.value === tab) ? tab : "profile";

	// Ensure URL always has ?tab= on first load
	useEffect(() => {
		if (!searchParams.get("tab")) {
			router.replace(`${pathname}?tab=profile`);
		}
	}, [pathname, searchParams, router]);

	const handleTabChange = (value: string) => {
		router.push(`${pathname}?tab=${value}`);
	};

	const ActiveComponent = Tabs.find((t) => t.value === activeTab)?.component;

	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 1);
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		updateScrollState();
		const observer = new ResizeObserver(updateScrollState);
		observer.observe(el);
		return () => observer.disconnect();
	}, [updateScrollState]);

	// Keep the active tab visible when it changes (e.g. opened via ?tab=)
	useEffect(() => {
		scrollRef.current
			?.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`)
			?.scrollIntoView({ block: "nearest", inline: "nearest" });
	}, [activeTab]);

	const scrollTabs = (direction: "left" | "right") => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollBy({
			left: (direction === "left" ? -1 : 1) * el.clientWidth * 0.6,
			behavior: "smooth",
		});
	};

	return (
		<div className="w-full">
			<div className="sticky border-b border-b-gray-200">
				<div
					ref={scrollRef}
					onScroll={updateScrollState}
					className="flex items-center gap-3 max-md:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{Tabs.map((t) => (
						<button
							key={t.value}
							data-tab={t.value}
							onClick={() => handleTabChange(t.value)}
							className={`${activeTab === t.value ? "border-b-3 border-b-[#00B3A6] rounded-none text-black" : "hover:text-black"} shrink-0 whitespace-nowrap px-10 max-md:px-4 py-3 cursor-pointer`}
						>
							<h3 className="text-sm max-md:text-xs font-medium">
								{t.name}
							</h3>
						</button>
					))}
				</div>
				{canScrollLeft && (
					<button
						type="button"
						aria-label="Scroll tabs left"
						onClick={() => scrollTabs("left")}
						className="absolute inset-y-0 left-0 flex w-10 items-center justify-start bg-linear-to-r from-[#F7FAFC] from-40% to-transparent cursor-pointer"
					>
						<ChevronLeft size={16} className="text-black/60" />
					</button>
				)}
				{canScrollRight && (
					<button
						type="button"
						aria-label="Scroll tabs right"
						onClick={() => scrollTabs("right")}
						className="absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-linear-to-l from-[#F7FAFC] from-40% to-transparent cursor-pointer"
					>
						<ChevronRight size={16} className="text-black/60" />
					</button>
				)}
			</div>
			<div className="pt-4 w-full">
				{ActiveComponent && <ActiveComponent />}
			</div>
		</div>
	);
}
