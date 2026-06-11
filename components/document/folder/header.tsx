"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddFileForm from "../form/add_file";
import { useGetFolders } from "@/hooks/document/get_folders";
import { useGetFolderById } from "@/hooks/document/get_folder_by_id";
import { useMemo } from "react";

interface HeaderProps {
  id: string;
}

function FolderHeaderSkeleton() {
  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col gap-1 w-2/3">
          <div className="h-8 w-1/3 rounded bg-[#E8E8E8] animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-[#F0F0F0] animate-pulse mt-2" />
        </div>
        <div className="flex flex-row gap-4">
          <div className="h-10 w-36 rounded-full bg-[#E8E8E8] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Header({ id }: HeaderProps) {
  const { data: folders, isLoading: isFoldersLoading } = useGetFolders();
  const { data: folderData, isLoading: isFolderLoading } = useGetFolderById(id);

  const loading = isFoldersLoading || isFolderLoading;

  const data = useMemo(
    () =>
      folderData ?? folders?.find((item) => String(item._id) === String(id)), // 👈 string compare, no Number()
    [folders, id, folderData],
  );

  if (loading) return <FolderHeaderSkeleton />;

  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="xl:text-2xl lg:text-xl/[110%] text-lg/[110%] font-medium text-[#3A2418]">
            {data?.name ?? "Folder"}
          </h2>
          <span className="xl:text-base text-sm font-medium text-foreground">
            {data?.description}
          </span>
        </div>
        <div className="flex flex-row gap-4">
          <CustomDrawer
            label="Upload files"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row items-center gap-2 xl:px-8 px-5 py-3"
              >
                <PlusIcon />
                <span>Add Files</span>
              </CustomButton>
            }
          >
            {(close) => (
              <AddFileForm folderId={data?._id ?? ""} onSuccess={close} />
            )}
          </CustomDrawer>
        </div>
      </div>
    </div>
  );
}
