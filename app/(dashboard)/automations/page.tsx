import { Metadata } from "next";
import { Zap } from "lucide-react";
import ModulePage from "@/components/modules/module_page";

export const metadata: Metadata = {
	title: "Automations | CRM360",
};

export default function Page() {
	return (
		<ModulePage
			title="Automations"
			description="Reusable email templates and the events that send them automatically"
			icon={Zap}
			emptyTitle="Automations is coming soon"
			emptyDescription="We're building reusable templates and automatic triggers that send them when something happens in your CRM. Check back shortly."
			comingSoon
		/>
	);
}
