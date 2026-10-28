import { Eye, Pencil } from "lucide-react";
import { CustomDrawer } from "../custom/common/drawer";
import AddCompanyForm from "./forms/add_company";
import CompanyDetailsSheet from "./forms/details";
import { useCompanyStore } from "@/stores/company/company_store";
import { useDeleteCompany } from "@/hooks/company/delete_companies";
import { Company } from "@/types/company";
import { SelectCheckbox } from "../custom/common/selectCheckbox";

interface CompanyCardProps {
	company: Company;
	selected?: boolean;
	onToggleSelect?: () => void;
}

export default function CompanyCard({
	company,
	selected = false,
	onToggleSelect,
}: CompanyCardProps) {
	const { setSelectedCompany } = useCompanyStore();
	const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();
	return (
		<div
			className={`w-full min-w-0 h-full bg-white border rounded-[8px] p-4 flex flex-col gap-4 transition-colors ${
				selected ? "border-primary ring-1 ring-primary" : "border-[#D9E1E8]"
			}`}
		>
			{/* Header */}
			<div className="flex flex-row items-center justify-between gap-3">
				<div className="flex flex-row items-center gap-3 min-w-0 flex-1">
					{onToggleSelect && (
						<SelectCheckbox
							label={`Select ${company.name}`}
							checked={selected}
							onChange={onToggleSelect}
						/>
					)}
					{/* Avatar */}
					<div className="w-9 h-9 rounded-lg bg-[#D8F3F1] flex items-center justify-center shrink-0">
						<span className="text-sm font-medium text-[#334155]">
							{company?.name.charAt(0) ?? "-----"}
						</span>
					</div>

					{/* Name + Industry */}
					<div className="flex flex-col min-w-0">
						<span
							title={company?.name}
							className="text-sm font-medium text-black truncate"
						>
							{company?.name ?? "-----"}
						</span>
						<span className="text-xs text-foreground truncate">
							{company?.industry ?? "-----"}
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-row items-center gap-4 shrink-0">
					<CustomDrawer
						label="Company Details"
						trigger={
							<button
								className="text-[#0091FE] hover:opacity-70 transition-opacity cursor-pointer"
								onClick={() => setSelectedCompany(company)}
							>
								<Eye size={20} />
							</button>
						}
					>
						<CompanyDetailsSheet
							onDelete={() => deleteCompany(company._id)}
							isLoading={isDeleting}
							onEdit={() => console.log("Edit")}
						/>
					</CustomDrawer>
					<CustomDrawer
						label="Edit Company"
						trigger={
							<button
								className="text-[#0091FE] hover:opacity-70 transition-opacity cursor-pointer"
								onClick={() => setSelectedCompany(company)}
							>
								<Pencil size={20} />
							</button>
						}
					>
						{(close) => (
							<AddCompanyForm
								mode="edit"
								company={company || undefined}
								onSuccess={() => {
									close();
								}}
							/>
						)}
					</CustomDrawer>
				</div>
			</div>

			{/* Divider */}
			<div className="w-full h-px bg-[#00B3A6]" />

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 py-2.5">
				<div className="flex flex-col gap-1">
					<span className="text-xs text-black">Contacts</span>
					<span className="text-sm font-medium text-black">
						{company?.stats.contact_count ?? 0}
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-xs text-black">Won revenue</span>
					<span className="text-sm font-medium text-black">
						${company?.stats.won_revenue ?? 0}
					</span>
				</div>
			</div>
		</div>
	);
}
