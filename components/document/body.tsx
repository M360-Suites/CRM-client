"use client";

import { FolderRowSkeleton } from "./skeleton/folder_row_skeleton";
import { useGetFolders } from "@/hooks/document/get_folders";
import { CustomButton } from "../custom/common/customButton";
import { useRouter } from "next/navigation";
import FolderItem from "./folderItem";
import { useState } from "react";

type PinStage = "setup" | "verify" | "granted";

export default function Body() {
  const router = useRouter();
  const { data: folders, isPending } = useGetFolders();

  const [stage, setStage] = useState<PinStage>(() => {
    const hasPin = localStorage.getItem("doc_pin");
    return hasPin ? "verify" : "setup";
  });

  // if (stage === "setup") {
  //   return <PinSetup onSuccess={() => setStage("verify")} />;
  // }

  // if (stage === "verify") {
  //   return (
  //     <PinVerify
  //       onSuccess={() => setStage("granted")}
  //       onReset={() => {
  //         localStorage.removeItem("doc_pin");
  //         setStage("setup");
  //       }}
  //     />
  //   );
  // }

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
          <CustomButton className="px-4 py-2 rounded-full bg-[#F5B7A3]">
            <span className="text-sm ">create your first folder</span>
          </CustomButton>
        </div>
      ) : (
        <div className="flex border flex-col w-full rounded-t-[10px]">
          <div className="grid grid-cols-6 px-5 py-6 rounded-t-[10px] border-b border-b-[#F3D9C4]  bg-[#FFF6EC]">
            {["Name", "Description", "Items", "Last Modified", "Action"].map(
              (header) => (
                <span
                  key={header}
                  className={`text-xs ${header === "Description" && "col-span-2"} ${header === "Action" && "text-right"} text-foreground font-medium`}
                >
                  {header}
                </span>
              ),
            )}
          </div>
          <div className="flex flex-col rounded-b-[8px]">
            {folders?.map((folder) => (
              <FolderItem
                key={folder._id}
                folder={folder}
                onClick={() => {
                  router.push(`/documents/folder/${folder._id}`);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
