"use client";

import React from "react";

import { CustomButton } from "@/components/custom/common/customButton";
import { Download, UploadIcon, PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddCompanyForm from "./forms/add_company";
import ImportCompanies from "./import";
import { useGetCompanies } from "@/hooks/company/get_companies";
import { GetCompanies } from "@/services/company/get_companies";
import { exportResource } from "@/lib/export";
import { toast } from "sonner";
import { handleRoleDisplay } from "@/lib/utils";
import { useUserProfile } from "@/hooks/user/profile";

export default function Header() {
	const { data: companies } = useGetCompanies({});
	const { data: user } = useUserProfile();

	const [exporting, setExporting] = React.useState(false);

	const handleExport = async (format: "csv" | "json") => {
		if (exporting) return;
		setExporting(true);
		try {
			const exported = await exportResource("companies", format, (page, limit) =>
				GetCompanies({ page, limit }),
			);
			if (!exported) toast.info("No companies to export");
		} catch {
			toast.error("Couldn't export companies. Please try again.");
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="w-full pt-8">
			<div className="flex max-md:flex-col items-center max-lg:items-start max-lg:gap-5 justify-between w-full">
				<div className="flex items-center justify-between w-full">
					<div className="flex flex-row items-start gap-2">
						<div className="flex flex-col gap-1">
							<h2 className="xl:text-2xl md:text-xl/[110%] text-lg/[110%] font-medium text-[#3A2418]">
								Companies
							</h2>
							<span className="xl:text-base text-sm font-medium text-foreground">
								{companies?.total} companies
							</span>
						</div>
						{user?.role && (
							<span className="text-[#0091FE] xl:text-sm max-md:hidden w-fit max-md:text-[8px] text-[10px] bg-[#F2F7FB] border border-[#D9E1E8] rounded-full py-1 px-3">
								{handleRoleDisplay(user.role)}
							</span>
						)}
					</div>
					<CustomDrawer
						label="Add Company"
						trigger={
							<CustomButton
								variant="default"
								className="rounded-full flex flex-row md:hidden items-center gap-2 md:px-5 px-3 py-2.5"
							>
								<PlusIcon className="" />
								<span>Add Company</span>
							</CustomButton>
						}
					>
						{(close) => (
							<AddCompanyForm
								mode="add"
								onSuccess={() => {
									close();
								}}
							/>
						)}
					</CustomDrawer>
				</div>

				<div className="flex flex-row gap-4 max-md:gap-2">
					<CustomDrawer
						label="Export Companies"
						trigger={
							<CustomButton
								variant="ghost"
								className="rounded-full flex flex-row items-center gap-2 md:px-5 px-3 py-2.5"
							>
								<UploadIcon className="" />
								<span>Export</span>
							</CustomButton>
						}
					>
						<div className="px-4">
							<p className="text-sm font-normal text-foreground/70 mt-5">
								Choose the format you want to export your
								companies in.
							</p>
							<div className="flex flex-col gap-3 mt-4">
								<CustomButton
									onClick={() => handleExport("csv")}
									disabled={exporting}
									variant="default"
									className="w-full py-3"
								>
									CSV
								</CustomButton>
								<CustomButton
									onClick={() => handleExport("json")}
									disabled={exporting}
									variant="ghost"
									className="w-full py-3"
								>
									JSON
								</CustomButton>
							</div>
						</div>
					</CustomDrawer>

					<CustomDrawer
						label="Import Companies"
						trigger={
							<CustomButton
								variant="ghost"
								className="rounded-full flex flex-row items-center gap-2 md:px-5 px-3 py-2.5"
							>
								<Download className="" />
								<span>Import</span>
							</CustomButton>
						}
					>
						{(close) => (
							<ImportCompanies onSuccess={() => close()} />
						)}
					</CustomDrawer>
					<CustomDrawer
						label="Add Company"
						trigger={
							<CustomButton
								variant="default"
								className="rounded-full flex flex-row items-center max-md:hidden gap-2 md:px-5 px-3 py-2.5"
							>
								<PlusIcon className="" />
								<span>Add Company</span>
							</CustomButton>
						}
					>
						{(close) => (
							<AddCompanyForm
								mode="add"
								onSuccess={() => {
									close();
								}}
							/>
						)}
					</CustomDrawer>
				</div>
			</div>
		</div>
	);
}
