"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomButton } from "@/components/custom/common/customButton";
import { Company } from "@/types/company";
import { AddCompanyRequestData, addCompanySchema } from "@/validation/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useAddCompany } from "@/hooks/company/add_company";
import { useEditCompany } from "@/hooks/company/edit_company";
import getDirtyValues from "@/lib/utils";

interface AddCompanyFormProps {
  mode: "add" | "edit";
  company?: Company;
  onSuccess?: () => void;
}

export default function AddCompanyForm({
  mode,
  company,
  onSuccess,
}: AddCompanyFormProps) {
  const { mutate: addCompany, isPending: isAdding } = useAddCompany();
  const { mutate: editCompany, isPending: isEditing } = useEditCompany();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<AddCompanyRequestData>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: {
      companyName: company?.name,
      email: company?.email,
      phone: company?.phone,
      companyAddress: company?.address,
      website: company?.website,
      industry: company?.industry,
      contactPerson: company?.contact_person,
    },
  });

  const isEdit = mode === "edit";
  const isPending = isAdding || isEditing;
  const hasChanges = Object.keys(dirtyFields).length > 0;

  const handleFormSubmit: SubmitHandler<AddCompanyRequestData> = (data) => {
    if (isEdit && company?._id) {
      if (!hasChanges) {
        onSuccess?.();
        return;
      }

      const payload = {
        _id: company._id,
        ...getDirtyValues(dirtyFields, data),
      };

      editCompany(payload, { onSuccess: () => onSuccess?.() });
    } else {
      addCompany(data, { onSuccess: () => onSuccess?.() });
    }
  };

  useEffect(() => {
    if (company) {
      reset({
        companyName: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        companyAddress: company.address || "",
        website: company.website || "",
        industry: company.industry || "",
        contactPerson: company.contact_person || "",
      });
    }
  }, [company, reset]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 px-6"
    >
      <div className="relative w-full">
        <CustomInput
          label="Company Name"
          placeholder="Enter company name"
          error={errors.companyName?.message}
          type="text"
          {...register("companyName", { required: true })}
        />
        {errors.companyName && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.companyName.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <CustomInput
          label="Industry"
          placeholder="Enter industry"
          error={errors.industry?.message}
          type="text"
          {...register("industry", { required: true })}
        />
        {errors.industry && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.industry.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <CustomInput
          label="Website"
          placeholder="Enter website URL"
          error={errors.website?.message}
          type="text"
          {...register("website", { required: true })}
        />
        {errors.website && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.website.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <CustomInput
          label="Contact Person"
          placeholder="Enter contact person"
          error={errors.contactPerson?.message}
          type="text"
          {...register("contactPerson", { required: true })}
        />
        {errors.contactPerson && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.contactPerson.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <CustomInput
          label="Email Address"
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
      <div className="relative w-full">
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
          label="Company Address"
          placeholder="Enter company address"
          error={errors.companyAddress?.message}
          type="text"
          {...register("companyAddress", { required: true })}
        />
        {errors.companyAddress && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.companyAddress.message}
          </span>
        )}
      </div>

      <div className="pt-10 px-5">
        <CustomButton
          type="submit"
          disabled={isAdding || isEditing || !hasChanges}
          className="w-full px-6 py-4"
        >
          {isPending
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save changes"
              : "Add company"}
        </CustomButton>
      </div>
    </form>
  );
}
