// Full-screen editors (no sidebar or navbar), e.g. the automation workflow builder.
export default function Layout({ children }: { children: React.ReactNode }) {
	return <div className="min-h-screen bg-[#F7FAFC] font-inter">{children}</div>;
}
