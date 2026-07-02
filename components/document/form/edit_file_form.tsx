"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "@/components/custom/common/customInput";
import { CustomButton } from "@/components/custom/common/customButton";
import { useEditFile } from "@/hooks/document/edit_file";
import { Document } from "@/types/document";

const editFileSchema = z.object({
  name: z.string().min(1, "File name is required"),
});

type EditFileFormValues = z.infer<typeof editFileSchema>;

interface EditFileFormProps {
  file: Document;
  onSuccess?: () => void;
}

export default function EditFileForm({ file, onSuccess }: EditFileFormProps) {
  const { mutate: editFile, isPending } = useEditFile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditFileFormValues>({
    resolver: zodResolver(editFileSchema),
    defaultValues: { name: file.original_name },
  });

  const watchedName = watch("name");
  const hasChanged = watchedName !== file.original_name;

  const onSubmit: SubmitHandler<EditFileFormValues> = (data) => {
    editFile(
      { id: file._id, name: data.name, folderId: file.folder_id },
      { onSuccess: () => onSuccess?.() },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-6">
      <div className="relative w-full">
        <CustomInput
          label="File Name"
          placeholder="Enter file name"
          error={errors.name?.message}
          {...register("name")}
        />
        {errors.name && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="w-full px-8 pt-10">
        <CustomButton
          type="submit"
          disabled={isPending || !hasChanged}
          className="w-full px-6 py-4 font-dm rounded-lg"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </CustomButton>
      </div>
    </form>
  );
}
