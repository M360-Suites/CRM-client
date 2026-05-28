"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddFolderForm from "@/components/document/form/add_document";
import { useGetFolders } from "@/hooks/document/get_folders";
import { useGetFolderById } from "@/hooks/document/get_folder_by_id";
import { useMemo } from "react";

interface HeaderProps {
  id: string;
}

export default function Header({ id }: HeaderProps) {
  const { data: folders } = useGetFolders();
  const { data: folderData } = useGetFolderById(id);

  const data = useMemo(
    () =>
      folderData ?? folders?.find((item) => String(item._id) === String(id)), // 👈 string compare, no Number()
    [folders, id, folderData],
  );

  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium text-[#3A2418]">
            {data?.name ?? "Folder"}
          </h2>
          <span className="text-base font-medium text-foreground">
            {data?.description}
          </span>
        </div>
        {/* <div className="flex flex-row gap-4">
          <CustomDrawer
            label="Create New Folder"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row items-center gap-2 px-8 py-3"
              >
                <PlusIcon />
                <span>Create folder</span>
              </CustomButton>
            }
          >
            {(close) => <AddFolderForm onSuccess={close} />}
          </CustomDrawer>
        </div> */}
      </div>
    </div>
  );
}
