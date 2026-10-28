import { Metadata } from "next";
import EmailBuilder from "@/components/automations/builder/email_builder";

export const metadata: Metadata = {
	title: "Email Builder | CRM360",
};

export default async function Page({
	params,
}: {
	params: Promise<{ id: string; stepId: string }>;
}) {
	const { id, stepId } = await params;
	return <EmailBuilder id={id} stepId={stepId} />;
}
