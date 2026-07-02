"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { useGetFolderById } from "@/hooks/document/get_folder_by_id";
import FileItem from "../fileItem";
import { useState } from "react";
import { Document } from "@/types/document";
import { CustomDrawer } from "@/components/custom/common/drawer";
import EditFileForm from "../form/edit_file_form";

interface BodyProps {
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
}

export default function Body({ id }: { id: string }) {
  const { data: folderData, isLoading: isFolderLoading } = useGetFolderById(id);
  const [editingFile, setEditingFile] = useState<Document | null>(null);

  // normalize: folderData may be ApiResponse wrapper or raw folder
  const documents =
    (folderData as any)?.data?.documents ??
    (folderData as any)?.documents ??
    [];

  const hasDocs = Array.isArray(documents) && documents.length > 0;

  // show skeleton when fetching
  if (isFolderLoading) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex flex-col gap-0 py-3.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#FFF3E6] first:rounded-t-[8px] last:rounded-b-[8px] border-b border-b-border last:border-b-0 pl-4 pr-8 py-3 overflow-hidden"
            >
              <div className="flex items-center gap-4 py-0.5 w-full">
                <div className="w-9 h-9 rounded-[8px] bg-[#E8E8E8] animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 w-3/4 rounded bg-[#E8E8E8] animate-pulse mb-2" />
                  <div className="h-3 w-1/3 rounded bg-[#F0F0F0] animate-pulse" />
                </div>
                <div className="w-16 h-3 rounded bg-[#E8E8E8] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
              <FileItem
                key={file._id}
                file={file}
                onEdit={() => setEditingFile(file)}
              />
            ))}
          </div>
        </div>
      )}

      {editingFile && (
        <CustomDrawer
          key={editingFile._id}
          trigger={<span />}
          label="Rename File"
          defaultOpen
          onOpenChange={(o) => {
            if (!o) setEditingFile(null);
          }}
        >
          {(close) => (
            <EditFileForm
              file={editingFile}
              onSuccess={() => {
                close();
                setEditingFile(null);
              }}
            />
          )}
        </CustomDrawer>
      )}
    </div>
  );
}
