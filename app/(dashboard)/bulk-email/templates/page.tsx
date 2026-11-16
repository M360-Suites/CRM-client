import { Metadata } from "next";
import TemplatesBody from "@/components/bulk_email/templates/body";

export const metadata: Metadata = {
	title: "Email Templates | CRM360",
};

export default function Page() {
	return <TemplatesBody />;
}
