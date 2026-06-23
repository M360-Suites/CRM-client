import { CustomDrawer } from "@/components/custom/common/drawer";
import { CustomButton } from "@/components/custom/common/customButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStaffs } from "@/hooks/user/admin/get_staffs";
import {useGetInvitations} from "@/hooks/user/admin/get_invited_staffs";
import { useRevokeInvite } from "@/hooks/user/admin/revoke_invite";
import { UserPlus, Pencil, Trash2, Loader } from "lucide-react";
import { handleRoleDisplay } from "@/lib/utils";
import AddStaffForm from "./forms/add_staff";

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
		<td className="px-6 py-4">
			<div className="flex items-center justify-end gap-4 lg:gap-5">
				<Skeleton className="h-4 w-4 rounded-sm" />
				<Skeleton className="h-4 w-4 rounded-sm" />
			</div>
		</td>
	</tr>
);

export default function RolesAccess() {
	const { data: staffs, isLoading } = useGetInvitations();
	const revokeInviteMutation = useRevokeInvite();
	const isEmpty = !staffs || staffs.length === 0;
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="flex items-center w-full justify-between">
				<h1 className="lg:text-base text-sm text-foreground font-medium">
					Manage invitations and staff access
				</h1>
				<CustomDrawer
					label="Add Staff"
					trigger={
						<CustomButton
							variant="default"
							className="rounded-full flex flex-row items-center gap-2 md:px-5 max-md:px-4 py-2"
						>
							<UserPlus className="" />
							<span>Invite staff</span>
						</CustomButton>
					}
				>
					{(close) => (
						<AddStaffForm
							onSuccess={() => {
								close();
							}}
						/>
					)}
				</CustomDrawer>
			</div>
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
							No Invitations yet
						</span>
						<CustomDrawer
							label="Add Staff"
							trigger={
								<CustomButton
									variant="default"
									className="rounded-full flex flex-row items-center gap-2 md:px-7 max-md:px-4 py-2"
								>
									<UserPlus />
									<span>Invite staff</span>
								</CustomButton>
							}
						>
							{(close) => (
								<AddStaffForm onSuccess={() => close()} />
							)}
						</CustomDrawer>
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
									<th className="text-end px-6 py-3 lg:text-sm text-xs font-medium text-foreground">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{staffs?.map((staff) => (
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
										<td className="px-6 py-4 text-sm font-normal text-foreground">
											<div className="flex items-center justify-end lg:gap-5 gap-4">
												<CustomDrawer
													label="Edit Staff"
													trigger={
														<Pencil className="w-4 h-4 cursor-pointer" />
													}
												>
													{(close) => (
														<AddStaffForm
															staff={staff}
															onSuccess={() =>
																close()
															}
														/>
													)}
												</CustomDrawer>
												<div>
													{revokeInviteMutation.isPending &&
													revokeInviteMutation.variables ===
														staff._id ? (
														<div className="w-4 h-4 text-red-400 cursor-pointer">
															<Loader className="animate-spin" />
														</div>
													) : (
														<Trash2
															className="w-4 h-4 text-red-400 cursor-pointer"
															onClick={() =>
															revokeInviteMutation.mutate(
																staff._id,
															)
															}
														/>
													)}
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
