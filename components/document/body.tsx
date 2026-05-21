"use client";

import { useDocumentStore } from "@/stores/document/doc_store";
import { CustomButton } from "../custom/common/customButton";
import FileItem from "./fileItem";

// Define the props for the Body component
interface BodyProps {
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
}

export default function Body() {
  const { files } = useDocumentStore();

  return (
    <div className="w-full flex flex-col">
      {files.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
          <span className="text-base font-normal text-foreground">
            No documents yet
          </span>
          <CustomButton className="px-4 py-2 rounded-full bg-[#F5B7A3]">
            <span className="text-sm ">Upload your first document</span>
          </CustomButton>
        </div>
      ) : (
        <div className="flex flex-col border border-[#F3D9C4] rounded-t-[8px] rounded-b-[8px]">
          {files.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}
