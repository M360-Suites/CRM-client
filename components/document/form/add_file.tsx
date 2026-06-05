"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import FileUpload from "../fileUpload";
import { CustomButton } from "@/components/custom/common/customButton";
import { useAddFiles } from "@/hooks/document/add_file";

interface AddFileFormValues {
  files: File[];
}

interface AddFileFormProps {
  onSuccess?: () => void;
  folderId: string;
}

export default function AddFileForm({ onSuccess, folderId }: AddFileFormProps) {
  const { mutate: addFiles, isPending } = useAddFiles();
  const { handleSubmit, setValue, watch } = useForm<AddFileFormValues>({
    defaultValues: { files: [] },
  });

  const files = watch("files");

  const onSubmit: SubmitHandler<AddFileFormValues> = (data) => {
    if (data.files.length === 0) return;
    addFiles(
      { files: data.files, folderId },
      {
        onSuccess: () => onSuccess?.(),
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-6"
    >
      <div className="relative w-full">
        <FileUpload
          onUpload={async (incoming) => {
            // merge incoming files with existing ones
            setValue("files", [...files, ...incoming]);
          }}
          onRemove={(removed) => {
            setValue(
              "files",
              files.filter((f) => f.name !== removed.name),
            );
          }}
        />
      </div>
      <div className="w-full px-8 pt-10">
        <CustomButton
          type="submit"
          disabled={isPending || files.length === 0}
          className="w-full px-6 py-4 font-dm rounded-lg"
        >
          <span className="text-base font-medium">
            {isPending
              ? "Uploading..."
              : `Upload ${files.length > 0 ? `(${files.length})` : "Files"}`}
          </span>
        </CustomButton>
      </div>
    </form>
  );
}
