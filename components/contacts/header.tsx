"use client";

import React from "react";
import { CustomButton } from "@/components/custom/common/customButton";
import { Download, UploadIcon, PlusIcon } from "lucide-react";
import { CustomDrawer } from "@/components/custom/common/drawer";
import AddContactForm from "./forms/add_contact";
import ImportContacts from "./import";
import { useGetContacts } from "@/hooks/contact/get_contacts";
import { downloadFile } from "@/lib/handler";

export default function Header() {
  const { data: contacts } = useGetContacts({
    temperature: undefined,
  });

  const handleExport = (format: "csv" | "json") => {
    if (!contacts?.data.length) return;

    if (format === "json") {
      const json = JSON.stringify(contacts, null, 2);
      downloadFile(json, "contacts.json", "application/json");
      return;
    }

    // CSV
    const headers = Object.keys(contacts.data[0]).join(",");
    const rows = contacts.data.map((c) =>
      Object.values(c)
        .map((v) => (typeof v === "string" ? `"${v.replace(/"/g, '""')}"` : v))
        .join(","),
    );
    const csv = [headers, ...rows].join("\n");
    downloadFile(csv, "contacts.csv", "text/csv");
  };

  return (
    <div className="w-full pt-8">
      <div className="flex max-md:flex-col max-md:items-start max-md:gap-4 items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="xl:text-2xl lg:text-xl/[110%] text-lg font-medium text-[#3A2418]">
            Contacts
          </h2>
          <span className="xl:text-base text-sm font-medium text-foreground">
            {contacts?.total} contacts
          </span>
        </div>
        <div className="flex flex-row md:gap-4 max-md:gap-2">
          <CustomDrawer
            label="Export Contacts"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 md:px-5 max-md:px-4 py-2.5"
              >
                <UploadIcon className="" />
                <span>Export</span>
              </CustomButton>
            }
          >
            <div className="px-4">
              <p className="text-sm font-normal text-foreground/70">
                Choose the format you want to export your contacts in.
              </p>
              <div className="flex flex-col gap-5 mt-8">
                <CustomButton
                  onClick={() => {
                    handleExport("csv");
                  }}
                  variant="default"
                  className="w-full py-3"
                >
                  CSV
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    handleExport("json");
                  }}
                  variant="ghost"
                  className="w-full py-3"
                >
                  JSON
                </CustomButton>
              </div>
            </div>
          </CustomDrawer>

          <CustomDrawer
            label="Import Contacts"
            trigger={
              <CustomButton
                variant="outline"
                className="rounded-full flex flex-row items-center gap-2 md:px-5 max-md:px-4 py-2.5"
              >
                <Download className="" />
                <span>Import</span>
              </CustomButton>
            }
          >
            {(close) => (
              <ImportContacts
                onSuccess={() => {
                  close();
                }}
              />
            )}
          </CustomDrawer>
          <CustomDrawer
            label="Add Contacts"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex flex-row items-center gap-2 md:px-5 max-md:px-4 py-2.5"
              >
                <PlusIcon className="" />
                <span>Add Contact</span>
              </CustomButton>
            }
          >
            {(close) => (
              <AddContactForm
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
