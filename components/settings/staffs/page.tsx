import { Pencil, Trash2, Loader } from "lucide-react";
import { handleRoleDisplay } from "@/lib/utils";
import { useGetStaffs } from "@/hooks/user/admin/get_staffs";
import { useDeleteStaff } from "@/hooks/user/admin/delete_staff";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddStaffForm from "@/components/settings/roles/forms/add_staff";

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

export default function Staffs() {
  const { data: staffs, isLoading } = useGetStaffs();
  const deleteStaffMutation = useDeleteStaff();
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
                  <th className="text-end px-6 py-3 lg:text-sm text-xs font-medium text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffs?.data.map((staff) => (
                  <tr key={staff._id} className="border-t border-[#E8E8E8]">
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
                              onSuccess={() => close()}
                            />
                          )}
                        </CustomDrawer>
                        <div>
                          {deleteStaffMutation.isPending &&
                          deleteStaffMutation.variables === staff._id ? (
                            <div className="w-4 h-4 text-red-400 cursor-pointer">
                              <Loader className="animate-spin" />
                            </div>
                          ) : (
                            <Trash2
                              className="w-4 h-4 text-red-400 cursor-pointer"
                              onClick={() =>
                                deleteStaffMutation.mutate(staff._id)
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
