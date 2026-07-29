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
import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { zodResolver } from "@hookform/resolvers/zod";
import useAddDeal from "@/hooks/pipeline/add_deal";
import useUpdateDeal from "@/hooks/pipeline/update_deal";
import { useEffect, useMemo } from "react";
import { Deal } from "@/types/pipeline";

interface AddDealFormProps {
  onSuccess: () => void;
  editMode: boolean;
  deal?: Deal;
}

export default function AddDealForm({
  onSuccess,
  editMode,
  deal,
}: AddDealFormProps) {
  const { data: pipelineBoard } = useGetPipelineBoard();
  const stageData = useMemo(
    () =>
      pipelineBoard?.stages.map((stage) => ({
        id: stage.id,
        name: stage.name,
      })),
    [pipelineBoard?.stages],
  );

  const { mutate: addDeal, isPending } = useAddDeal();
  const { mutate: updateDeal, isPending: isUpdating } = useUpdateDeal();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddDealRequestData, any, AddDealOutputData>({
    resolver: zodResolver(addDealSchema),
    defaultValues: editMode
      ? {
          title: deal?.title,
          value: deal?.value,
          source: deal?.source,
          industry: deal?.industry,
          stage_id: deal?.stage_id,
        }
      : undefined,
  });

  useEffect(() => {
    if (editMode && deal) {
      reset({
        title: deal.title,
        value: deal.value,
        source: deal.source,
        industry: deal.industry,
        stage_id: deal.stage_id,
      });
    }
  }, [editMode, deal, reset, stageData]);

  const onSubmit: SubmitHandler<AddDealOutputData> = (data) => {
    console.log("onSubmit", data);
    if (editMode) {
      if (!deal?.id) {
        console.error("Cannot update deal: missing deal id");
        return;
      }

      updateDeal(
        { id: deal.id, ...data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      const payload = {
        title: data.title,
        value: data.value,
        source: data.source,
        industry: data.industry,
        stage_id: data.stage_id,
      };
      addDeal(payload, {
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
          name="stage_id"
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Stage"
              placeholder="Select stage"
              error={errors.stage_id?.message}
              value={field.value}
              onChange={(v) => field.onChange(v)}
              selectable={
                stageData?.map((s) => ({ name: s.name, value: s.id })) ?? []
              }
            />
          )}
        />
        {errors.stage_id && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.stage_id.message}
          </span>
        )}
      </div>

      <div className="pt-6 px-6">
        <CustomButton
          type="submit"
          disabled={isPending || (editMode && !isDirty) || isUpdating}
          className="w-full px-6 py-4 font-inter"
        >
          {isPending ? "Saving..." : isUpdating ? "Updating..." : "Save Deal"}
        </CustomButton>
      </div>
    </form>
  );
}
