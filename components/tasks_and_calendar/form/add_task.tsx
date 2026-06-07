"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddTaskRequestData, addTaskSchema } from "@/validation/task";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddTaskForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTaskRequestData>({
    resolver: zodResolver(addTaskSchema),
  });
  const onSubmit: SubmitHandler<AddTaskRequestData> = (data) =>
    console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6"
    >
      <CustomInput
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        type="text"
        {...(register("title"), { required: true })}
      />
      <div className="flex items-center gap-3 w-full">
        <div className="relative w-full">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Type"
                value={field.value}
                onChange={(v) => field.onChange(v)}
                placeholder="Select type"
                error={errors.type?.message}
                selectable={[
                  { name: "Task", value: "task" },
                  { name: "Calendar", value: "calendar" },
                ]}
              />
            )}
          />
          {errors.type && (
            <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
              {errors.type.message}
            </span>
          )}
        </div>
        <div className="relative w-full">
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Priority"
                value={field.value}
                onChange={(v) => field.onChange(v)}
                placeholder="Select priority"
                error={errors.priority?.message}
                selectable={[
                  { name: "Low", value: "low" },
                  { name: "Medium", value: "medium" },
                  { name: "High", value: "high" },
                ]}
              />
            )}
          />
          {errors.priority && (
            <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
              {errors.priority.message}
            </span>
          )}
        </div>
      </div>
      {/* <CustomInput
        label="Industry"
        placeholder="Enter industry"
        error={errors.due_at?.message}
        type="text"
        {...(register("industry"), { required: true })}
      /> */}

      <div className="flex items-center gap-3">
        <CustomInput
          label="Duration (mins)"
          placeholder="Enter task duration"
          error={errors.duration_minutes?.message}
          type="number"
          {...(register("duration_minutes"), { required: true })}
        />
        <CustomInput
          label="Location"
          placeholder="Enter Location"
          error={errors.location?.message}
          type="text"
          {...(register("location"), { required: true })}
        />
      </div>
      {/* <CustomInput
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
      /> */}

      <div className="pt-6 px-6">
        <CustomButton type="submit" className="w-full px-6 py-4 font-inter">
          Save Deal
        </CustomButton>
      </div>
    </form>
  );
}
