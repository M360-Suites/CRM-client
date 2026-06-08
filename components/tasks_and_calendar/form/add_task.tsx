"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddTaskRequestData, addTaskSchema } from "@/validation/task";
import { useAddTask } from "@/hooks/tasks/add_task";
import { ControlledDateTimePicker } from "@/components/custom/common/customDateTimePicker";
import { useGetDeals } from "@/hooks/pipeline/get_deals";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddTaskFormProps {
  onSuccess?: () => void;
}

export default function AddTaskForm({ onSuccess }: AddTaskFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTaskRequestData, Error>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      status: "pending",
    },
  });
  const { data: deals } = useGetDeals();
  const { mutate: addTask, isPending } = useAddTask();

  const onSubmit: SubmitHandler<AddTaskRequestData> = (data) => {
    console.log("Form Data:", data);
    addTask(data, {
      onSuccess: () => onSuccess?.(),
    });
  };

  const dealData = deals?.map((d) => ({ name: d.title, value: d.id })) ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6"
    >
      <div className="relative w-full">
        <CustomInput
          label="Title"
          placeholder="Enter task title"
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
      <ControlledDateTimePicker
        name="due_at"
        control={control}
        label="Due Date & Time"
        placeholder="Select date & time"
        rules={{ required: "Please select a date and time" }}
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

      <div className="flex items-center gap-3">
        <div className="relative w-full">
          <CustomInput
            label="Duration (mins)"
            placeholder="Enter task duration"
            error={errors.duration_minutes?.message}
            type="text"
            {...register("duration_minutes")}
          />
          <span className="text-xs text-foundation-error-6 absolute left-0 -bottom-5">
            {errors.duration_minutes?.message}
          </span>
        </div>
        <div className="relative w-full">
          <CustomInput
            label="Location"
            placeholder="Enter Location"
            error={errors.location?.message}
            type="text"
            {...register("location")}
          />
          {errors.location && (
            <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
              {errors.location.message}
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full">
        <CustomInput
          label="Meeting Url"
          placeholder="https://meet.google.com/see-you-olu"
          error={errors.meeting_url?.message}
          type="text"
          {...register("meeting_url")}
        />
        {errors.meeting_url && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.meeting_url.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <Controller
          name="deal_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              label="Linked Deal"
              value={field.value}
              onChange={(v) => field.onChange(v)}
              placeholder="Select Linked Deal"
              error={errors.deal_id?.message}
              selectable={dealData}
            />
          )}
        />
        {errors.deal_id && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.deal_id.message}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <CustomInput
          textArea={true}
          label="Description"
          placeholder="Enter description"
          error={errors.description?.message}
          {...register("description")}
        />
        {errors.description && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="pt-6 px-6">
        <CustomButton
          type="submit"
          disabled={isPending}
          className="w-full px-6 py-4 font-inter"
        >
          {isPending ? "Adding..." : "Add Task"}
        </CustomButton>
      </div>
    </form>
  );
}
