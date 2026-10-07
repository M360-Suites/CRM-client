import { Metadata } from "next";
import { Mails } from "lucide-react";
import ModulePage from "@/components/modules/module_page";

export const metadata: Metadata = {
	title: "Bulk Email | CRM360",
};

export default function Page() {
	return (
		<ModulePage
			title="Bulk Email"
			description="Send email campaigns to many contacts at once"
			icon={Mails}
			emptyTitle="Bulk Email is coming soon"
			emptyDescription="We're building bulk email campaigns so you can reach many contacts at once. Check back shortly."
			comingSoon
		/>
	);
}
