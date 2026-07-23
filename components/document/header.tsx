"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddFolderForm from "@/components/document/form/add_document";

export default function Header() {
  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between max-md:gap-4 w-full">
        <div className="flex flex-col gap-4 items-start">
          <div className="flex flex-col gap-1">
            <h2 className="xl:text-2xl lg:text-xl/[110%] text-lg/[110%] font-medium text-[#3A2418]">
              Documents
            </h2>
            <span className="lg:text-base md:text-sm text-xs font-medium text-foreground">
              Proposals, contracts and files attached to your deals
            </span>
          </div>
          <CustomDrawer
            label="Create New Folder"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row items-center md:hidden gap-2 xl:px-8 md:px-5 px-3 py-3"
              >
                <PlusIcon className="" />
                <span className="max-md:text-sm">Create folder</span>
              </CustomButton>
            }
          >
            {(close) => <AddFolderForm onSuccess={close} />}
          </CustomDrawer>
        </div>
        <div className="flex">
          <CustomDrawer
            label="Create New Folder"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row w-fit items-center max-md:hidden gap-2 xl:px-8 md:px-5 px-3 py-3"
              >
                <PlusIcon className="" />
                <span className="max-md:text-sm">Create folder</span>
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
