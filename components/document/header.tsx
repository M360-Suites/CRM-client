"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { UploadIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";

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
            label="Upload Documents"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row items-center gap-2 px-8 py-3"
              >
                <UploadIcon className="" />
                <span>Upload file</span>
              </CustomButton>
            }
          >
            <div>Hello World</div>
          </CustomDrawer>
        </div>
      </div>
    </div>
  );
}
