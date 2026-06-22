import { CustomDrawer } from "@/components/custom/common/drawer";
import { CustomButton } from "@/components/custom/common/customButton";
import { UserPlus } from "lucide-react";
import AddStaffForm from "./forms/add_staff";

export default function RolesAccess() {
  const isEmpty = true;
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-base text-foreground font-medium">
          Manage who can view and edit data across the workspace.
        </h1>
        <CustomDrawer
          label="Add Staff"
          trigger={
            <CustomButton
              variant="default"
              className="rounded-full flex flex-row items-center gap-2 md:px-5 max-md:px-4 py-2"
            >
              <UserPlus className="" />
              <span>Add staff</span>
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
        {isEmpty ? (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              No staff added yet
            </span>
            <CustomDrawer
              label="Add Staff"
              trigger={
                <CustomButton
                  variant="default"
                  className="rounded-full flex flex-row items-center gap-2 md:px-7 max-md:px-4 py-2"
                >
                  <UserPlus className="" />
                  <span>Add staff</span>
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
        ) : (
          <div>
            {/* list of staff with their roles and permissions */}
            {/* each staff item should have an edit and delete button */}
          </div>
        )}
      </div>
    </div>
  );
}
