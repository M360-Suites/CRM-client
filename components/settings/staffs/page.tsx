import { Pencil, Trash2, UserPlus } from "lucide-react";
import { handleRoleDisplay } from "@/lib/utils";
import { useGetStaffs } from "@/hooks/user/admin/get_staffs";
import { useRevokeInvite } from "@/hooks/user/admin/revoke_invite";
import {Skeleton} from "@/components/ui/skeleton";


const StaffRowSkeleton = () => (
	<tr className="border-t border-[#E8E8E8]">
		<td className="px-6 py-4">
			<Skeleton className="h-4 w-32" />
		</td>
		<td className="px-6 py-4">
			<Skeleton className="h-4 w-44" />
		</td>
		<td className="px-6 py-4">
			<Skeleton className="h-4 w-24" />
		</td>
		
	</tr>
);


export default function Staffs() {
    const { data: staffs, isLoading } = useGetStaffs();

    const revokeInviteMutation = useRevokeInvite();
    const isEmpty = !staffs || staffs.data.length === 0;
    return (
      <div className="flex flex-col  w-full gap-5 pt-4">
				<h1 className="lg:text-base text-sm text-foreground font-medium">
					Manage staff and their roles
				</h1>
    <div>
				{isLoading ? (
					<div className="overflow-hidden border border-[#E8E8E8] rounded-[12px]">
						<table className="w-full">
							<thead className="bg-[#F5B7A3]">
								<tr>
									<th className="text-left px-6 py-3  lg:text-sm text-xs font-medium text-foreground">
										Name
									</th>
									<th className="text-left px-6 py-3  lg:text-sm text-xs font-medium text-foreground">
										Email
									</th>
									<th className="text-left px-6 py-3  lg:text-sm text-xs font-medium text-foreground">
										Role
									</th>
									<th className="text-end px-6 py-3  lg:text-sm text-xs font-medium text-foreground">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{Array.from({ length: 5 }).map((_, index) => (
									<StaffRowSkeleton key={index} />
								))}
							</tbody>
						</table>
					</div>
				) : isEmpty ? (
					<div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
						<span className="text-base font-normal text-foreground">
							No staff added yet
						</span>
					</div>
				) : (
					<div className="overflow-hidden border border-[#E8E8E8] rounded-t-[12px]">
						<table className="w-full">
							<thead className="bg-[#F5B7A3]/50">
								<tr>
									<th className="text-left px-6 py-3 lg:text-sm text-xs font-medium text-foreground">
										Name
									</th>
									<th className="text-left px-6 py-3 lg:text-sm text-xs font-medium text-foreground">
										Email
									</th>
									<th className="text-left px-6 py-3 lg:text-sm text-xs font-medium text-foreground">
										Role
									</th>
								</tr>
							</thead>
							<tbody>
								{staffs?.data.map((staff) => (
									<tr
										key={staff._id}
										className="border-t border-[#E8E8E8]"
									>
										<td className="px-6 py-4 text-sm font-normal text-foreground">
											{staff.display_name}
										</td>
										<td className="px-6 py-4 text-sm font-normal text-foreground">
											{staff.email}
										</td>
										<td className="px-6 py-4 text-sm font-normal text-foreground">
											{handleRoleDisplay(staff.role)}
										</td>
										
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
            </div>
            </div>
  )
}
