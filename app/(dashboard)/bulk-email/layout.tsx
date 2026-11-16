import ScrollbarScope from "@/components/bulk_email/scrollbar_scope";

export default function BulkEmailLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<ScrollbarScope />
			{children}
		</>
	);
}
