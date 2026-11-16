import { Metadata } from "next";
import BroadcastEditor from "@/components/bulk_email/broadcast/broadcast_editor";

export const metadata: Metadata = {
	title: "New Broadcast | CRM360",
};

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ id?: string; template?: string }>;
}) {
	const { id, template } = await searchParams;
	return <BroadcastEditor id={id} templateId={template} />;
}
