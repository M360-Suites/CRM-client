"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from "@/components/custom/common/customInput";
import { CustomButton } from "@/components/custom/common/customButton";
import {
  AddDocumentRequestData,
  addDocumentSchema,
} from "@/validation/document";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateFolder from "@/hooks/document/create_document";

interface AddFolderFormProps {
  onSuccess?: () => void;
}

export default function AddFolderForm({ onSuccess }: AddFolderFormProps) {
  const { mutate: addDocument, isPending: isAdding } = useCreateFolder();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDocumentRequestData>({
    resolver: zodResolver(addDocumentSchema),
  });
  const onSubmit: SubmitHandler<AddDocumentRequestData> = (data) => {
    console.log(data);
    addDocument(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-6"
    >
      <div className="relative w-full">
        <CustomInput
          label="Folder Name"
          placeholder="Enter folder name"
          error={errors.folderName?.message}
          {...register("folderName", { required: true })}
        />
        {errors.folderName && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.folderName.message}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <CustomInput
          label="Description"
          placeholder="Enter description"
          error={errors.folderDescription?.message}
          type="text"
          {...register("folderDescription", { required: true })}
        />
        {errors.folderDescription && (
          <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
            {errors.folderDescription.message}
          </span>
        )}
      </div>
      <div className="w-full px-8 pt-10">
        <CustomButton
          type="submit"
          disabled={isAdding}
          className="w-full px-6 py-4 font-dm rounded-lg"
        >
          {isAdding ? "Creating Folder..." : "Create Folder"}
        </CustomButton>
      </div>
    </form>
  );
}
