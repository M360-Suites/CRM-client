import type { LucideIcon } from "lucide-react";

export default function ModulePage({
	title,
	description,
	icon: Icon,
	emptyTitle,
	emptyDescription,
	comingSoon = false,
}: {
	title: string;
	description: string;
	icon: LucideIcon;
	emptyTitle: string;
	emptyDescription: string;
	comingSoon?: boolean;
}) {
	return (
		<div className="flex flex-col gap-6 py-8">
			<div className="flex flex-col gap-1 w-full">
				<div className="flex items-center gap-3">
					<h2 className="xl:text-2xl text-xl/[110%] font-medium text-[#3A2418]">
						{title}
					</h2>
					{comingSoon && (
						<span className="rounded-full bg-[#FFF4D6] px-2.5 py-1 text-xs font-medium text-[#9A6A14]">
							Coming soon
						</span>
					)}
				</div>
				<span className="xl:text-base text-sm font-medium text-foreground">
					{description}
				</span>
			</div>

			<div className="flex flex-col items-center justify-center gap-3 rounded-[8px] border border-[#E8E8E8] bg-white px-6 py-20 text-center">
				<div className="rounded-full bg-[#E6F2FF] p-4">
					<Icon className="h-7 w-7" color="#0076D6" />
				</div>
				<h3 className="text-lg font-medium text-[#0F172A]">
					{emptyTitle}
				</h3>
				<p className="max-w-md text-sm text-[#64748B]">
					{emptyDescription}
				</p>
			</div>
		</div>
	);
}
