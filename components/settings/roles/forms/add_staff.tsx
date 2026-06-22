"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddStaffData, addStaffSchema } from "@/validation/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateFolder from "@/hooks/document/create_document";

interface AddFolderFormProps {
  onSuccess?: () => void;
}

export default function AddStaffForm({ onSuccess }: AddFolderFormProps) {
  const { mutate: addDocument, isPending: isAdding } = useCreateFolder();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStaffData>({
    resolver: zodResolver(addStaffSchema),
  });
  const onSubmit: SubmitHandler<AddStaffData> = (data) => {
    console.log(data);
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
                { name: "Sales Rep", value: "sales-rep" },
                { name: "Sales Manager", value: "sales-manager" },
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

      <div className="w-full px-8 pt-10">
        <CustomButton
          type="submit"
          disabled={isAdding}
          className="w-full px-6 py-4 font-dm rounded-lg"
        >
          {isAdding ? "Adding Staff..." : "Add staff"}
        </CustomButton>
      </div>
    </form>
  );
}
