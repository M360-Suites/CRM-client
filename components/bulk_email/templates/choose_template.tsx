"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useCreateEmailTemplate } from "@/hooks/bulk_email/templates";
import { renderDesignHtml } from "../email_editor/render";
import { StarterTemplate, TemplateCategory } from "@/types/bulk_email";
import { TEMPLATE_CATEGORIES } from "../data";
import { LIBRARY_TEMPLATES } from "./library";
import TemplateCard from "./template_card";
import DesignThumbnail from "./design_thumbnail";

export default function ChooseTemplate() {
	const router = useRouter();
	const createTemplate = useCreateEmailTemplate();

	// Starter designs are copied into a new template the organisation owns
	const pickStarter = (starter: StarterTemplate) => {
		if (createTemplate.isPending) return;
		const design = structuredClone(starter.design);
		createTemplate.mutate(
			{
				name: starter.name,
				subject: starter.name,
				html: renderDesignHtml(design),
				design,
			},
			{ onSuccess: (t) => router.push(`/bulk-email/templates/${t._id}`) },
		);
	};
	const [category, setCategory] = useState<TemplateCategory>("starting");
	const active = TEMPLATE_CATEGORIES.find((c) => c.value === category)!;
	const templates = LIBRARY_TEMPLATES.filter((t) => t.category === category);

	return (
		<div className="w-full flex flex-col gap-6 pt-8 pb-8">
			<h2 className="flex items-center gap-3 xl:text-[28px] lg:text-xl/[110%] text-lg font-medium text-[#0F172A]">
				<Link
					href="/bulk-email/templates"
					aria-label="Back to templates"
					className="p-1 rounded hover:bg-gray-100"
				>
					<ChevronLeft size={16} color="#94A3B8" />
				</Link>
				Choose a template to customize
				{createTemplate.isPending && (
					<LoaderCircle size={20} className="animate-spin" color="#0091FE" />
				)}
			</h2>

			<div className="flex max-md:flex-col gap-6 md:gap-8">
				<nav className="md:w-50 shrink-0 bg-white md:min-h-[80vh] p-4 flex md:flex-col gap-1.5 max-md:overflow-x-auto">
					{TEMPLATE_CATEGORIES.map((c) => (
						<button
							key={c.value}
							onClick={() => setCategory(c.value)}
							className={`flex items-center justify-between gap-2 rounded-full px-3 py-1.5 text-xs whitespace-nowrap cursor-pointer ${
								c.value === category
									? "bg-[#F1F5F9] font-medium text-[#0F172A]"
									: "text-[#334155] hover:bg-gray-50"
							}`}
						>
							{c.label}
							{c.isNew && (
								<span className="rounded-full bg-[#ECFDF5] px-1.5 py-0.5 text-[9px] text-[#059669]">
									New
								</span>
							)}
						</button>
					))}
				</nav>

				<div className="flex flex-col gap-4 flex-1 pt-4">
					<div className="flex flex-col gap-2">
						<h3 className="text-base text-[#0F172A]">{active.heading}</h3>
						<p className="text-xs text-[#334155] max-w-xl leading-5">
							{active.description}
						</p>
					</div>
					<div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7 max-w-[860px]">
						{templates.map((template) => (
							<TemplateCard
								key={template._id}
								template={template}
								preview={<DesignThumbnail design={template.design} />}
								onSelect={() => pickStarter(template)}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
