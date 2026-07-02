"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { AddTaskRequestData, addTaskSchema } from "@/validation/task";
import { useAddTask } from "@/hooks/tasks/add_task";
import { useEditTask } from "@/hooks/tasks/edit_task";
import { ControlledDateTimePicker } from "@/components/custom/common/customDateTimePicker";
import { useGetDeals } from "@/hooks/pipeline/get_deals";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@/types/task";

interface AddTaskFormProps {
  onSuccess?: () => void;
  task?: Task;
}

export default function AddTaskForm({ onSuccess, task }: AddTaskFormProps) {
  const isEditing = !!task;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AddTaskRequestData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: task
      ? {
          title: task.title,
          type: task.type,
          priority: task.priority,
          status: task.status,
          description: task.description ?? "",
          due_at: task.due_at,
          duration_minutes: task.duration_minutes?.toString() ?? "",
          location: task.location ?? "",
          meeting_url: task.meeting_url ?? "",
          deal_id: task.deal_id?._id ?? "",
        }
      : {
          status: "pending",
        },
  });

  const { data: deals } = useGetDeals();
  const { mutate: addTask, isPending: isAdding } = useAddTask();
  const { mutate: editTask, isPending: isUpdating } = useEditTask();
  const isPending = isAdding || isUpdating;

  const onSubmit: SubmitHandler<AddTaskRequestData> = (data) => {
    if (isEditing) {
      editTask({ _id: task._id, ...data }, { onSuccess: () => onSuccess?.() });
    } else {
      addTask(data, { onSuccess: () => onSuccess?.() });
    }
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

      {isEditing && (
        <div className="relative w-full">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Status"
                value={field.value}
                onChange={(v) => field.onChange(v)}
                placeholder="Select status"
                error={errors.status?.message}
                selectable={[
                  { name: "Pending", value: "pending" },
                  { name: "In Progress", value: "in_progress" },
                  { name: "Completed", value: "completed" },
                ]}
              />
            )}
          />
        </div>
      )}

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

      <div className="pt-6 md:px-6">
        <CustomButton
          type="submit"
          disabled={isPending || (isEditing && !isDirty)}
          className="w-full px-6 py-4 font-inter"
        >
          {isPending
            ? isEditing
              ? "Updating..."
              : "Adding..."
            : isEditing
              ? "Update Task"
              : "Add Task"}
        </CustomButton>
      </div>
    </form>
  );
}
