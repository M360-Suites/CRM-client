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
import { useEditFolder } from "@/hooks/document/edit_folder";
import { Folder } from "@/types/document";

interface AddFolderFormProps {
  onSuccess?: () => void;
  folder?: Folder;
}

export default function AddFolderForm({
  onSuccess,
  folder,
}: AddFolderFormProps) {
  const isEditMode = !!folder;

  const { mutate: addDocument, isPending: isAdding } = useCreateFolder();
  const { mutate: editDocument, isPending: isEditing } = useEditFolder();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddDocumentRequestData>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: isEditMode
      ? { folderName: folder.name, folderDescription: folder.description }
      : {},
  });

  // Track live values to detect changes in edit mode
  const watchedName = watch("folderName");
  const watchedDescription = watch("folderDescription");
  const hasChanged = isEditMode
    ? watchedName !== folder.name || watchedDescription !== folder.description
    : true;

  const onSubmit: SubmitHandler<AddDocumentRequestData> = (data) => {
    if (isEditMode) {
      editDocument(
        {
          id: folder._id,
          data: {
            name: data.folderName,
            description: data.folderDescription ?? "",
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      addDocument(data, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      });
    }
  };

  const isPending = isAdding || isEditing;

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
          textArea
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
      <div className="w-full px-8 max-md:px-1 pt-10">
        <CustomButton
          type="submit"
          disabled={isPending || !hasChanged}
          className="w-full px-6 py-4 font-inter max-md:text-sm rounded-lg"
        >
          {isPending
            ? isEditMode
              ? "Saving..."
              : "Creating Folder..."
            : isEditMode
              ? "Save Changes"
              : "Create Folder"}
        </CustomButton>
      </div>
    </form>
  );
}
