"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddContactRequestData, addContactSchema } from "@/validation/contact";
import { useGetCompanies } from "@/hooks/company/get_companies";
import { useAddContact } from "@/hooks/contact/add_contact";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddContactFormProps {
  contact?: AddContactRequestData;
  onSuccess?: () => void;
}

export default function AddContactForm({
  contact,
  onSuccess,
}: AddContactFormProps) {
  const { data: companies } = useGetCompanies();
  const { mutate: addContact, isPending } = useAddContact();
  const companyOptions = companies?.map((company) => ({
    name: company.name,
    value: company._id,
  }));
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddContactRequestData>({
    resolver: zodResolver(addContactSchema),
  });
  const onSubmit: SubmitHandler<AddContactRequestData> = (data) => {
    console.log(data);
    addContact(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-6"
    >
      <div className="flex flex-row gap-4">
        <div className="relative w-full">
          <CustomInput
            label="First Name"
            placeholder="Enter first name"
            error={errors.firstName?.message}
            {...register("firstName", { required: true })}
          />
          {errors.firstName && (
            <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
              {errors.firstName.message}
            </span>
          )}
        </div>
        <div className="relative w-full">
          <CustomInput
            label="Last Name"
            placeholder="Enter last name"
            error={errors.lastName?.message}
            type="text"
            {...register("lastName", { required: true })}
          />
          {errors.lastName && (
            <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>
      <div className="w-full relative">
        <CustomInput
          label="Email"
          placeholder="Enter email address"
          error={errors.email?.message}
          type="email"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="w-full relative">
        <CustomInput
          label="Phone Number"
          placeholder="Enter phone number"
          error={errors.phone?.message}
          type="text"
          {...register("phone", { required: true })}
        />
        {errors.phone && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.phone.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <CustomInput
          label="Role/Title"
          placeholder="Enter role"
          error={errors.role?.message}
          type="text"
          {...register("role", { required: true })}
        />
        {errors.role && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.role.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <Controller
          name="temperature"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Temperature"
              value={field.value}
              onChange={(v) => field.onChange(v)}
              placeholder="Select temperature"
              error={errors.temperature?.message}
              selectable={[
                { name: "Hot", value: "hot" },
                { name: "Warm", value: "warm" },
                { name: "Cold", value: "cold" },
              ]}
            />
          )}
        />
        {errors.temperature && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.temperature.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Company"
              value={field.value}
              onChange={(v) => field.onChange(v)}
              placeholder="Select company"
              error={errors.company?.message}
              selectable={companyOptions || []}
            />
          )}
        />
        {errors.company && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.company.message}
          </span>
        )}
      </div>

      <CustomButton
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-4 font-dm rounded-lg"
      >
        {isPending ? "Saving..." : "Save Contact"}
      </CustomButton>
    </form>
  );
}
