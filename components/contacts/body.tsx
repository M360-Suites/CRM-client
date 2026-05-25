"use client";

import { Search } from "lucide-react";
import { ContactTabs, getInitials, handleTime } from "@/lib/utils";
import { useContactStore } from "@/stores/contact/contact_store";
import { useGetContacts } from "@/hooks/contact/get_contacts";
import { useDeleteContact } from "@/hooks/contact/delete_contact";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import Detail from "./forms/detail";
import { useState } from "react";

const ContactRowSkeleton = () => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0 animate-pulse">
    <div className="flex items-center gap-4 flex-1">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-3.5 w-36 bg-gray-200 rounded-full" />
        <div className="h-3 w-24 bg-gray-200 rounded-full" />
      </div>
    </div>
    <div className="flex-1">
      <div className="h-3.5 w-28 bg-gray-200 rounded-full" />
    </div>
    <div className="flex-1">
      <div className="h-3.5 w-24 bg-gray-200 rounded-full" />
    </div>
    <div className="h-7 w-16 bg-gray-200 rounded-full" />
  </div>
);

export default function Body() {
  const categoryObjects = Object.values(ContactTabs);
  const categories = [...categoryObjects];
  const { setSelectedContact } = useContactStore();
  const [activeTab, setActiveTab] = useState(categories[0]);
  const {
    data: contacts,
    isPending,
    isError,
  } = useGetContacts(
    activeTab === ContactTabs.ALL ? undefined : activeTab.toLowerCase(),
  );
  const { mutate: deleteContact, isPending: isLoading } = useDeleteContact();
  return (
    <div className="w-full flex-col flex gap-8">
      <div className="flex flex-row items-center gap-17">
        <div className="border bg-[#FFF3E6] w-lg rounded-full text-[#3A2418] flex flex-row items-center gap-2 py-3 px-3">
          <Search color="#3A2418" size={20} />
          <input
            type="text"
            placeholder="Search by name,email,company..."
            className="flex-1 placeholder:text-sm h-full outline-0 focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-row items-center gap-2 py-2">
          {categories.map((tab, index) => (
            <button
              key={index}
              className={`border ${
                tab === ContactTabs.ALL
                  ? "rounded-full px-5"
                  : "rounded-full px-4"
              } flex flex-row items-center cursor-pointer text-base font-normal capitalize gap-2 py-2 ${
                tab.toLowerCase() === activeTab.toLowerCase()
                  ? "bg-[#E2725B] text-white"
                  : "bg-[#FFF3E6] text-[#3A2418]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        {/* Loading state */}
        {isPending && (
          <div className="border border-[#F3D9C4] rounded-t-[12px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContactRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isPending && (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              Failed to load contacts
            </span>
            <CustomButton className="px-4 py-2 rounded-full">
              <span className="text-sm">Retry</span>
            </CustomButton>
          </div>
        )}

        {/* Contacts list */}
        {!isPending && !isError && contacts && contacts.length > 0 && (
          <div className="border border-[#F3D9C4] rounded-t-[12px]">
            {contacts?.map((contact, index) => (
              <CustomDrawer
                key={index}
                label="Contact Details"
                trigger={
                  <div
                    className="flex flex-row items-center justify-between w-full p-4 border-b last:border-b-0 cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <div className="bg-[#D8F3F1] h-10 w-10 rounded-full flex items-center justify-center text-base font-medium text-[#2F9E94]">
                        {getInitials(
                          contact.first_name + " " + contact.last_name,
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-normal">
                          {contact.first_name + " " + contact.last_name}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {contact.role_title}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start flex-1">
                      <span className="text-sm font-normal text-foreground">
                        {contact.company_id?.name ?? "-------------"}
                      </span>
                    </div>

                    <div className="flex flex-col items-start flex-1">
                      <span className="text-sm font-normal text-foreground">
                        {handleTime(contact.created_at)}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        contact.temperature === ContactTabs.HOT
                          ? "bg-[#E6F7F1] text-[#2CA678]"
                          : contact.temperature === ContactTabs.WARM
                            ? "bg-[#FFF6EC] text-[#E2725B]"
                            : "bg-[#F3D9C4] text-[#E2725B]"
                      }`}
                    >
                      <span className="text-sm font-normal text-foreground">
                        {contact.temperature}
                      </span>
                    </div>
                  </div>
                }
              >
                {(close) => (
                  <Detail
                    onDelete={() =>
                      deleteContact(contact._id, {
                        onSuccess: () => close(),
                      })
                    }
                    isLoading={isLoading}
                  />
                )}
              </CustomDrawer>
            ))}
          </div>
        )}

        {/* Filtered empty state */}
        {!isPending && !isError && contacts?.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              {activeTab === "All"
                ? "No contacts yet"
                : `No ${activeTab.toLowerCase()} contacts found`}
            </span>
            {activeTab === "All" && (
              <CustomButton className="px-4 py-2 rounded-full">
                <span className="text-sm">Add your first Contact</span>
              </CustomButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
