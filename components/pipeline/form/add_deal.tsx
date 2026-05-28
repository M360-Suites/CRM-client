"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import {
  AddDealRequestData,
  addDealSchema,
  AddDealOutputData,
} from "@/validation/pipeline";
import { zodResolver } from "@hookform/resolvers/zod";
import useAddDeal from "@/hooks/pipeline/add_deal";

interface AddDealFormProps {
  onSuccess: () => void;
}

export default function AddDealForm({ onSuccess }: AddDealFormProps) {
  const { mutate: addDeal, isPending } = useAddDeal();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDealRequestData, any, AddDealOutputData>({
    resolver: zodResolver(addDealSchema),
  });

  const onSubmit: SubmitHandler<AddDealOutputData> = (data) => {
    const payload = {
      title: data.title,
      value: data.value,
      source: data.source,
      industry: data.industry,
      stage: data.stage,
    };
    addDeal(payload, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6"
    >
      <div className="relative w-full">
        <CustomInput
          label="Deal Title"
          placeholder="Enter deal title"
          error={errors.title?.message}
          type="text"
          {...register("title")}
        />
        {errors.title && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <CustomInput
          label="Deal Value"
          placeholder="Enter deal value"
          error={errors.value?.message}
          type="text"
          {...register("value")}
        />
        {errors.value && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.value.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <CustomInput
          label="Source"
          placeholder="Referral, Website, LinkedIn, etc."
          error={errors.source?.message}
          type="text"
          {...register("source")}
        />
        {errors.source && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.source.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <CustomInput
          label="Industry"
          placeholder="Enter industry"
          error={errors.industry?.message}
          type="text"
          {...register("industry")}
        />
        {errors.industry && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.industry.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <Controller
          control={control}
          name="stage"
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Stage"
              placeholder="Select stage"
              error={errors.stage?.message}
              value={field.value}
              onChange={(v) => field.onChange(v)}
              selectable={[
                { name: "Lead", value: "leads" },
                { name: "Qualified", value: "qualified" },
                { name: "Proposal", value: "proposals" },
                { name: "Negotiation", value: "negotiations" },
                { name: "Closed", value: "closed" },
                { name: "Lost", value: "lost" },
              ]}
            />
          )}
        />
        {errors.stage && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.stage.message}
          </span>
        )}
      </div>

      <div className="pt-6 px-6">
        <CustomButton
          type="submit"
          disabled={isPending}
          className="w-full px-6 py-4 font-inter"
        >
          {isPending ? "Saving..." : "Save Deal"}
        </CustomButton>
      </div>
    </form>
  );
}
