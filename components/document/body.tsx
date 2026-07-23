"use client";

import { FolderRowSkeleton } from "./skeleton/folder_row_skeleton";
import { useGetFolders } from "@/hooks/document/get_folders";
import { useDeleteFolder } from "@/hooks/document/delete_folder";
import { CustomButton } from "../custom/common/customButton";
import { CustomDrawer } from "../custom/common/drawer";
import AddFolderForm from "./form/add_document";
import { useRouter } from "next/navigation";
import FolderItem from "./folderItem";
import { useState } from "react";
import { Folder } from "@/types/document";

export default function Body() {
  const router = useRouter();
  const { data: folders, isPending } = useGetFolders();
  const { mutate: deleteFolder } = useDeleteFolder();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  return (
    <div className="w-full flex flex-col">
      {isPending ? (
        <div className="flex border flex-col w-full rounded-t-[10px]">
          <div className="grid grid-cols-6 px-5 py-6 rounded-t-[10px] border-b border-b-[#F3D9C4]  bg-[#FFF6EC]">
            {["Name", "Description", "Items", "Last Modified", "Action"].map(
              (header) => (
                <span
                  key={header}
                  className={`text-xs ${header === "Description" ? "col-span-2" : ""} ${header === "Action" ? "text-right" : ""} text-foreground font-medium`}
                >
                  {header}
                </span>
              ),
            )}
          </div>
          <div className="flex flex-col rounded-b-[8px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <FolderRowSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : folders?.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
          <span className="text-base font-normal text-foreground">
            No folders yet
          </span>
          <CustomDrawer
            label="Create New Folder"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row items-center gap-2 px-8 py-3"
              >
                <span>Create your first folder</span>
              </CustomButton>
            }
          >
            {(close) => <AddFolderForm onSuccess={close} />}
          </CustomDrawer>
        </div>
      ) : (
        <div className="flex border flex-col w-full rounded-t-[10px]">
          <div className="grid grid-cols-6 lg:px-5 px-3 md:py-6 py-4 gap-2 rounded-t-[10px] border-b border-b-[#F3D9C4]  bg-[#FFF6EC]">
            {["Name", "Desc", "Items", "Modified", "Action"].map((header) => (
              <span
                key={header}
                className={`md:text-xs text-[10px] ${header === "Name" && "col-span-2"} col-span-1 ${header === "Action" && "text-right"} text-foreground font-medium`}
              >
                {header}
              </span>
            ))}
          </div>
          <div className="flex flex-col rounded-b-[8px]">
            {folders?.map((folder) => (
              <FolderItem
                key={folder._id}
                isDeleting={deletingId === folder._id}
                folder={folder}
                onDelete={() => {
                  setDeletingId(folder._id);
                  deleteFolder(folder._id, {
                    onSettled: () => setDeletingId(null),
                  });
                }}
                onEdit={() => setEditingFolder(folder)}
                onClick={() => {
                  router.push(`/documents/folder/${folder._id}`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Edit drawer — remounts with defaultOpen whenever editingFolder changes */}
      {editingFolder && (
        <CustomDrawer
          key={editingFolder._id}
          trigger={<span />}
          label="Edit Folder"
          defaultOpen
          onOpenChange={(o) => {
            if (!o) setEditingFolder(null);
          }}
        >
          {(close) => (
            <AddFolderForm
              folder={editingFolder}
              onSuccess={() => {
                close();
                setEditingFolder(null);
              }}
            />
          )}
        </CustomDrawer>
      )}
    </div>
  );
}
