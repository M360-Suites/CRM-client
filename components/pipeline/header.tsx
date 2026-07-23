"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddDealForm from "./form/add_deal";

export default function Header() {
  return (
    <div className="w-full pt-8 font-inter">
      <div className="flex flex-row max-md:flex-col max-md:items-start max-md:gap-5 items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="xl:text-2xl lg:text-xl/[110%] text-lg font-medium  text-[#3A2418]">
            Pipeline
          </h2>
          <span className="xl:text-base text-sm font-medium text-foreground">
            Drag deals between stages to update.
          </span>
        </div>
        <div className="flex flex-row gap-4">
          <CustomDrawer
            label="Add Deal"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex text-sm flex-row items-center gap-2 px-8 py-3"
              >
                <PlusIcon className="" />
                <span>Add deal</span>
              </CustomButton>
            }
          >
            {(close) => (
              <AddDealForm
                onSuccess={() => {
                  close();
                }}
              />
            )}
          </CustomDrawer>
        </div>
      </div>
    </div>
  );
}
