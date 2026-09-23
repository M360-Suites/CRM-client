"use client";

import { useState } from "react";
import Header from "@/components/revenue-engine/header";
import Body from "@/components/revenue-engine/body";
import type { RevenueTabKey } from "@/components/revenue-engine/header";

export default function Page() {
	const [activeTab, setActiveTab] = useState<RevenueTabKey>("overview");
	const [refreshing, setRefreshing] = useState(false);

	return (
		<div className="flex flex-col gap-6 py-8">
			<Header
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				refreshing={refreshing}
				onRefresh={() => setRefreshing((value) => !value)}
			/>
			<Body activeTab={activeTab} />
		</div>
	);
}
