"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddFolderForm from "@/components/document/form/add_document";

export default function Header() {
  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium text-[#3A2418]">Documents</h2>
          <span className="text-base font-medium text-foreground">
            Proposals, contracts and files attached to your deals
          </span>
        </div>
        <div className="flex flex-row gap-4">
          <CustomDrawer
            label="Create New Folder"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row items-center gap-2 px-8 py-3"
              >
                <PlusIcon className="" />
                <span>Create folder</span>
              </CustomButton>
            }
          >
            {(close) => <AddFolderForm onSuccess={close} />}
          </CustomDrawer>
        </div>
      </div>
    </div>
  );
}
