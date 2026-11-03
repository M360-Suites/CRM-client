"use client";

import Link from "next/link";
import { LayoutGrid, PlusIcon } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";

export default function Header() {
	return (
		<div className="w-full pt-8">
			<div className="flex max-md:flex-col max-md:items-start max-md:gap-4 items-center justify-between w-full">
				<div className="flex flex-col gap-1">
					<h2 className="xl:text-2xl lg:text-xl/[110%] text-lg font-medium text-[#3A2418]">
						Bulk Email
					</h2>
					<span className="xl:text-base text-sm font-medium text-foreground">
						Emails you have sent to your Contacts
					</span>
				</div>
				<div className="flex flex-row items-center md:gap-4 gap-2">
					<CustomButton
						asChild
						variant="ghost"
						className="rounded-full flex flex-row items-center gap-2 md:px-5 max-md:px-4 py-2.5"
					>
						<Link href="/bulk-email/templates">
							<LayoutGrid />
							<span>Templates</span>
						</Link>
					</CustomButton>
					<CustomButton
						asChild
						variant="default"
						className="rounded-full flex flex-row items-center gap-2 md:px-10 max-md:px-4 py-2.5"
					>
						<Link href="/bulk-email/new">
							<PlusIcon />
							<span>New Mail</span>
						</Link>
					</CustomButton>
				</div>
			</div>
		</div>
	);
}
