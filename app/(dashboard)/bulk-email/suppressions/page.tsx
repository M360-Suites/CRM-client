import { Metadata } from "next";
import Suppressions from "@/components/bulk_email/suppressions/suppressions";

export const metadata: Metadata = {
	title: "Suppressed Contacts | CRM360",
};

export default function Page() {
	return <Suppressions />;
}
