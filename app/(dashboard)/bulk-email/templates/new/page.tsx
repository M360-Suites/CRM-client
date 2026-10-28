import { Metadata } from "next";
import ChooseTemplate from "@/components/bulk_email/templates/choose_template";

export const metadata: Metadata = {
	title: "Choose a Template | CRM360",
};

export default function Page() {
	return <ChooseTemplate />;
}
