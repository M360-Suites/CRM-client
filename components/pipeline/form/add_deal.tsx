"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddDealRequestData, addDealSchema } from "@/validation/pipeline";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddDealForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddDealRequestData>({
    resolver: zodResolver(addDealSchema),
  });
  const onSubmit: SubmitHandler<AddDealRequestData> = (data) =>
    console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6"
    >
      <CustomInput
        label="Deal Title"
        placeholder="Enter deal title"
        error={errors.title?.message}
        type="text"
        {...(register("title"), { required: true })}
      />
      <CustomInput
        label="Deal Value"
        placeholder="Enter deal value"
        error={errors.value?.message}
        type="number"
        {...(register("value"), { required: true })}
      />
      <CustomInput
        label="Source"
        placeholder="Enter source"
        error={errors.source?.message}
        type="text"
        {...(register("source"), { required: true })}
      />
      <CustomInput
        label="Industry"
        placeholder="Enter industry"
        error={errors.industry?.message}
        type="text"
        {...(register("industry"), { required: true })}
      />

      <CustomSelect
        label="Stage"
        placeholder="Select stage"
        error={errors.stage?.message}
        {...(register("stage"), { required: true })}
        selectable={[
          { name: "Lead", value: "Lead" },
          { name: "Qualified", value: "Qualified" },
          { name: "Proposal", value: "Proposal" },
          { name: "Negotiation", value: "Negotiation" },
          { name: "Closed", value: "Closed" },
          { name: "Lost", value: "Lost" },
        ]}
      />

      <div className="pt-6 px-6">
        <CustomButton type="submit" className="w-full px-6 py-4 font-inter">
          Save Deal
        </CustomButton>
      </div>
    </form>
  );
}
