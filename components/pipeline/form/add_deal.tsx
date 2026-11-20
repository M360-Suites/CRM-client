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
import { useGetCompanies } from "@/hooks/company/get_companies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Deal } from "@/types/pipeline";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  formatAmountInput,
  parseAmountInput,
} from "@/lib/currency";

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

  const { data: companies } = useGetCompanies({});
  const companyOptions = companies?.data.map((company) => ({
    name: company.name,
    value: company._id,
  }));

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
          currency: deal?.currency ?? DEFAULT_CURRENCY,
          source: deal?.source,
          industry: deal?.industry,
          stage_id: deal?.stage_id,
          company_id: deal?.company?.id ?? null,
        }
      : { currency: DEFAULT_CURRENCY },
  });

  useEffect(() => {
    if (editMode && deal) {
      reset({
        title: deal.title,
        value: deal.value,
        currency: deal.currency ?? DEFAULT_CURRENCY,
        source: deal.source,
        industry: deal.industry,
        stage_id: deal.stage_id,
        company_id: deal.company?.id ?? null,
      });
    }
  }, [editMode, deal, reset, stageData]);

  const onSubmit: SubmitHandler<AddDealOutputData> = (data) => {
    if (editMode) {
      if (!deal?.id) {
        console.error("Cannot update deal: missing deal id");
        return;
      }

      updateDeal(
        // null clears the company on the deal
        { id: deal.id, ...data, company_id: data.company_id ?? null },
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
        currency: data.currency,
        source: data.source,
        industry: data.industry || undefined,
        stage_id: data.stage_id,
        company_id: data.company_id || undefined,
      };
      addDeal(payload, {
        onSuccess: () => {
          reset({ currency: DEFAULT_CURRENCY });
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

      <div className="relative w-full flex flex-col gap-2 font-inter">
        <label className="text-foreground font-regular text-sm/[110%] max-md:text-xs">
          Deal Value
        </label>
        <div
          className={`rounded-[10px] border flex flex-row items-center gap-1 bg-[#F2F7FB] p-2 focus-within:border-[#00B3A6] transition-colors ${
            errors.value || errors.currency
              ? "border-foundation-error-6"
              : "border-[#D9E1E8]"
          }`}
        >
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
              >
                <SelectTrigger
                  aria-label="Currency"
                  onBlur={field.onBlur}
                  className="h-11! shrink-0 gap-2 [&_[data-currency-name]]:hidden *:data-[slot=select-value]:gap-2 rounded-lg border-[#D9E1E8] bg-white pl-2 pr-2.5 shadow-xs cursor-pointer hover:bg-gray-50 focus-visible:ring-[#00B3A6]/30 focus-visible:border-[#00B3A6]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  sideOffset={6}
                  className="w-64 p-1 font-inter"
                >
                  {CURRENCIES.map((c) => (
                    <SelectItem
                      key={c.code}
                      value={c.code}
                      className="py-2 pl-2 cursor-pointer"
                    >
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-[#D8F3F1] px-1 text-xs font-semibold text-[#2F9E94]">
                        {c.symbol}
                      </span>
                      <span className="text-sm font-medium">{c.code}</span>
                      <span
                        data-currency-name
                        className="text-xs opacity-60 truncate"
                      >
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            control={control}
            name="value"
            render={({ field }) => (
              <input
                ref={field.ref}
                name={field.name}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                value={formatAmountInput(field.value as number | string)}
                onChange={(e) =>
                  field.onChange(parseAmountInput(e.target.value).numeric)
                }
                onBlur={field.onBlur}
                className="flex-1 min-w-0 px-3 py-2 outline-none bg-transparent text-base text-foreground max-md:text-sm placeholder:text-sm placeholder:text-foundation-gray-4"
              />
            )}
          />
        </div>
        {(errors.value || errors.currency) && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.value?.message ?? errors.currency?.message}
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
        <Controller
          name="company_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Company (optional)"
              value={field.value ?? undefined}
              onChange={(v) => field.onChange(v)}
              placeholder="Select company"
              error={errors.company_id?.message}
              selectable={companyOptions || []}
            />
          )}
        />
        {errors.company_id && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.company_id.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <CustomInput
          label="Industry (optional)"
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
