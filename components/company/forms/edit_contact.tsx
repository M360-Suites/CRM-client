"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddContactRequestData, addContactSchema } from "@/validation/contact";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddContactRequestData>({
    resolver: zodResolver(addContactSchema),
  });
  const onSubmit: SubmitHandler<AddContactRequestData> = (data) =>
    console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6"
    >
      <div className="flex flex-row gap-4">
        <CustomInput
          label="First Name"
          placeholder="Enter first name"
          error={errors.firstName?.message}
          type="text"
          {...(register("firstName"), { required: true })}
        />
        <CustomInput
          label="Last Name"
          placeholder="Enter last name"
          error={errors.lastName?.message}
          type="text"
          {...(register("lastName"), { required: true })}
        />
      </div>
      <CustomInput
        label="Email"
        placeholder="Enter email address"
        error={errors.email?.message}
        type="email"
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
        label="Role/Title"
        placeholder="Enter role"
        error={errors.role?.message}
        type="text"
        {...(register("role"), { required: true })}
      />
      <CustomSelect
        label="Temperature"
        placeholder="Select temperature"
        error={errors.temperature?.message}
        selectable={[
          { name: "Hot", value: "Hot" },
          { name: "Warm", value: "Warm" },
          { name: "Cold", value: "Cold" },
        ]}
      />
      <CustomInput
        label="Company"
        placeholder="Enter company name"
        error={errors.company?.message}
        type="text"
        {...(register("company"), { required: true })}
      />

      <CustomButton
        type="submit"
        className="w-full px-6 py-3 font-dm rounded-full"
      >
        Save Contact
      </CustomButton>
    </form>
  );
}
