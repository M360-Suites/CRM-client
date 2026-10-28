import { Metadata } from "next";
import WorkflowBuilder from "@/components/automations/builder/workflow_builder";

export const metadata: Metadata = {
	title: "Workflow Builder | CRM360",
};

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <WorkflowBuilder id={id} />;
}
