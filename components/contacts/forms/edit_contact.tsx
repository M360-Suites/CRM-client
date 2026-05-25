"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddContactRequestData, addContactSchema } from "@/validation/contact";
import { useGetCompanies } from "@/hooks/company/get_companies";
import { useEditContact } from "@/hooks/contact/edit_contact ";
import { Contact } from "@/types/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import getDirtyValues from "@/lib/utils";

interface EditContactFormProps {
  contact: Contact;
  onSuccess?: () => void;
}

const toTemperature = (val?: string): "hot" | "warm" | "cold" | undefined => {
  const lower = val?.toLowerCase();
  if (lower === "hot" || lower === "warm" || lower === "cold") return lower;
  return undefined;
};

export default function EditContactForm({
  contact,
  onSuccess,
}: EditContactFormProps) {
  const { data: companies } = useGetCompanies();
  const { mutate: editContact, isPending } = useEditContact();

  const companyOptions = companies?.map((company) => ({
    name: company.name,
    value: company._id,
  }));

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<AddContactRequestData>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      firstName: contact?.first_name ?? "",
      lastName: contact?.last_name ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      role: contact?.role_title ?? "",
      temperature: toTemperature(contact?.temperature),
      company: contact?.company_id?._id ?? "",
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        firstName: contact.first_name ?? "",
        lastName: contact.last_name ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        role: contact.role_title ?? "",
        temperature: toTemperature(contact.temperature),
        company: contact.company_id?._id ?? "",
      });
    }
  }, [contact, reset]);

  const hasChanges = Object.keys(dirtyFields).length > 0;

  const onSubmit: SubmitHandler<AddContactRequestData> = (data) => {
    if (!hasChanges) {
      onSuccess?.();
      return;
    }

    const payload = {
      _id: contact._id,
      ...getDirtyValues(dirtyFields, data),
    };

    editContact(payload, {
      onSuccess: () => onSuccess?.(),
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
            {...register("firstName")}
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
            {...register("lastName")}
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
          {...register("email")}
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
          {...register("phone")}
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
          {...register("role")}
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
        disabled={isPending || !hasChanges}
        className="w-full px-6 py-4 font-dm rounded-lg"
      >
        {isPending ? "Saving..." : hasChanges ? "Save changes" : "No changes"}
      </CustomButton>
    </form>
  );
}
