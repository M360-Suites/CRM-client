import { Metadata } from "next";
import TemplateEditor from "@/components/bulk_email/editor/template_editor";

export const metadata: Metadata = {
	title: "Edit Template | CRM360",
};

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <TemplateEditor id={id} />;
}
