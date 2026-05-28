"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { useGetFolders } from "@/hooks/document/get_folders";
import { useGetFolderById } from "@/hooks/document/get_folder_by_id";
import FileItem from "../fileItem";

interface BodyProps {
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
}

export default function Body({ id }: { id: string }) {
  console.log("Folder ID in Body component:", id);
  const { data: folderData } = useGetFolderById(id);

  // normalize: folderData may be ApiResponse wrapper or raw folder
  const documents =
    (folderData as any)?.data?.documents ??
    (folderData as any)?.documents ??
    [];

  const hasDocs = Array.isArray(documents) && documents.length > 0;

  return (
    <div className="w-full flex flex-col">
      {!hasDocs ? (
        <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
          <span className="text-base font-normal text-foreground">
            No files yet
          </span>
          <CustomButton className="px-4 py-2 rounded-full bg-[#F5B7A3]">
            <span className="text-sm ">upload your first file</span>
          </CustomButton>
        </div>
      ) : (
        <div className="flex border flex-col w-full rounded-t-[10px]">
          <div className="flex flex-col rounded-b-[8px]">
            {documents.map((file: any) => (
              <FileItem key={file._id} file={file} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
