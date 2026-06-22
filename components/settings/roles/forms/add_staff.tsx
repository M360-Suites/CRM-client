"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddStaffData, addStaffSchema } from "@/validation/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddStaff } from "@/hooks/user/admin/add_staff";
import { useEditStaff } from "@/hooks/user/admin/edit_staff";
import { UserInvitationResponse } from "@/types/user";

interface AddStaffFormProps {
  onSuccess?: () => void;
  staff?: UserInvitationResponse;
}

export default function AddStaffForm({ onSuccess, staff }: AddStaffFormProps) {
  const isEditing = !!staff;

  const { mutate: addStaff, isPending: isAdding } = useAddStaff();
  const { mutate: updateStaff, isPending: isUpdating } = useEditStaff();

  const isPending = isAdding || isUpdating;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddStaffData>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: staff
      ? {
          fullname: staff.display_name,
          email: staff.email,
          role: staff.role as "admin" | "sales_rep" | "sales_manager" | "viewer",
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<AddStaffData> = (data) => {
  if (isEditing) {
    updateStaff(
      { _id: staff._id, ...data },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      }
    );
  } else {
    addStaff(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-6"
    >
      <div className="relative w-full">
        <CustomInput
          label="Fullname"
          placeholder="Enter fullname"
          error={errors.fullname?.message}
          {...register("fullname", { required: true })}
        />
        {errors.fullname && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.fullname.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <CustomInput
          label="Email"
          placeholder="Enter email"
          error={errors.email?.message}
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Role"
              value={field.value}
              onChange={(v) => field.onChange(v)}
              placeholder="Select role"
              error={errors.role?.message}
              selectable={[
                { name: "Admin", value: "admin" },
                { name: "Sales Rep", value: "sales_rep" },
                { name: "Sales Manager", value: "sales_manager" },
                { name: "Viewer", value: "viewer" },
              ]}
            />
          )}
        />
        {errors.role && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.role.message}
          </span>
        )}
      </div>

      <div className="w-full pt-10">
        <CustomButton
          type="submit"
          disabled={isPending || !isDirty}
          className="w-full px-6 py-4 font-dm rounded-lg"
        >
          {isPending
            ? isEditing
              ? "Updating Staff..."
              : "Adding Staff..."
            : isEditing
            ? "Update Staff"
            : "Add Staff"}
        </CustomButton>
      </div>
    </form>
  );
}