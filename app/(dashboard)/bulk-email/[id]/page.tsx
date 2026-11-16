import { Metadata } from "next";
import BroadcastReport from "@/components/bulk_email/report/report";

export const metadata: Metadata = {
	title: "Email Report | CRM360",
};

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <BroadcastReport id={id} />;
}
