import { Metadata } from "next";
import { Gauge } from "lucide-react";
import ModulePage from "@/components/modules/module_page";

export const metadata: Metadata = {
	title: "Revenue Engine | CRM360",
};

export default function Page() {
	return (
		<ModulePage
			title="Revenue Engine"
			description="One module, eight linked layers — ad spend in, attributed revenue out."
			icon={Gauge}
			emptyTitle="Revenue Engine is coming soon"
			emptyDescription="We're putting the finishing touches on ad connectors, attribution, cost intelligence and more. Check back shortly."
			comingSoon
		/>
	);
}
