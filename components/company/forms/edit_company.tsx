"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddCompanyRequestData, addCompanySchema } from "@/validation/company";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditCompanyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCompanyRequestData>({
    resolver: zodResolver(addCompanySchema),
  });
  const onSubmit: SubmitHandler<AddCompanyRequestData> = (data) =>
    console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6"
    >
      <CustomInput
        label="Company Name"
        placeholder=""
        error={errors.companyName?.message}
        type="text"
        {...(register("companyName"), { required: true })}
      />
      <CustomInput
        label="Industry"
        placeholder=""
        error={errors.industry?.message}
        type="text"
        {...(register("industry"), { required: true })}
      />
      <CustomInput
        label="Website"
        placeholder="Enter website URL"
        error={errors.website?.message}
        type="email"
        {...(register("website"), { required: true })}
      />
      <CustomInput
        label="Contact Person"
        placeholder="Enter contact person"
        error={errors.contactPerson?.message}
        type="text"
        {...(register("contactPerson"), { required: true })}
      />
      <CustomInput
        label="Email Address"
        placeholder="Enter email address"
        error={errors.email?.message}
        type="text"
        {...(register("email"), { required: true })}
      />
      <CustomInput
        label="Phone Number"
        placeholder="Enter phone number"
        error={errors.phone?.message}
        type="text"
        {...(register("phone"), { required: true })}
      />
      <CustomInput
        label="Company Address"
        placeholder="Enter company address"
        error={errors.companyAddress?.message}
        type="text"
        {...(register("companyAddress"), { required: true })}
      />

      <div className="pt-10 px-5">
        <CustomButton type="submit" className="w-full px-6 py-4">
          Save Changes
        </CustomButton>
      </div>
    </form>
  );
}
