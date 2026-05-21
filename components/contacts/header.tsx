"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { Download, UploadIcon, PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddContactForm from "./forms/add_contact";
import ImportContacts from "./import";
import { useContactStore } from "@/stores/contact/contact_store";

export default function Header() {
  const { contacts } = useContactStore();

  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium text-[#3A2418]">Contacts</h2>
          <span className="text-base font-medium text-foreground">
            {contacts.length} contacts
          </span>
        </div>
        <div className="flex flex-row gap-4">
          <CustomDrawer
            label="Export Contacts"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
              >
                <UploadIcon className="" />
                <span>Export</span>
              </CustomButton>
            }
          >
            <div className="p-4">
              <span className="text-lg font-medium text-foreground">
                Export Contacts
              </span>
              <p className="text-sm font-normal text-foreground/70 mt-2">
                Choose the format you want to export your contacts in.
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <CustomButton variant="outline" className="w-full">
                  CSV
                </CustomButton>
                <CustomButton variant="outline" className="w-full">
                  Excel
                </CustomButton>
                <CustomButton variant="outline" className="w-full">
                  PDF
                </CustomButton>
              </div>
            </div>
          </CustomDrawer>

          <CustomDrawer
            label="Import Contacts"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
              >
                <Download className="" />
                <span>Import</span>
              </CustomButton>
            }
          >
            <ImportContacts />
          </CustomDrawer>
          <CustomDrawer
            label="Add Contacts"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
              >
                <PlusIcon className="" />
                <span>Add Contact</span>
              </CustomButton>
            }
          >
            <AddContactForm />
          </CustomDrawer>
        </div>
      </div>
    </div>
  );
}
