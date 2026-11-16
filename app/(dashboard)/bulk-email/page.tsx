import { Metadata } from "next";
import Header from "@/components/bulk_email/header";
import Body from "@/components/bulk_email/body";

export const metadata: Metadata = {
	title: "Bulk Email | CRM360",
};

export default function Page() {
	return (
		<div className="w-full flex flex-col gap-12 pb-8">
			<Header />
			<Body />
		</div>
	);
}
