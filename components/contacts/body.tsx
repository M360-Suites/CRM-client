"use client";

import { Search } from "lucide-react";
import { ContactTabs, getInitials, handleTime } from "@/lib/utils";
import { useContactStore } from "@/stores/contact/contact_store";
import { useGetContacts } from "@/hooks/contact/get_contacts";
import { useDeleteContact } from "@/hooks/contact/delete_contact";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import CustomPagination from "../custom/common/customPagination";
import AddContactForm from "./forms/add_contact";
import Detail from "./forms/detail";
import { useState } from "react";

const ContactRowSkeleton = () => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0 animate-pulse">
    <div className="flex items-center gap-4 flex-1">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-3.5 md:w-36 w-20 bg-gray-200 rounded-full" />
        <div className="h-3  md:w-24 w-15 bg-gray-200 rounded-full" />
      </div>
    </div>
    <div className="flex-1">
      <div className="h-3.5 md:w-28 w-14 bg-gray-200 rounded-full" />
    </div>
    <div className="flex-1">
      <div className="h-3.5 md:w-24 w-14 bg-gray-200 rounded-full" />
    </div>
    <div className="h-7 md:w-16 w-10  bg-gray-200 rounded-full" />
  </div>
);

export default function Body() {
  const categoryObjects = Object.values(ContactTabs);
  const categories = [...categoryObjects];
  const { setSelectedContact } = useContactStore();
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");

  const {
    data: contacts,
    isPending,
    isError,
  } = useGetContacts({
    temperature:
      activeTab === ContactTabs.ALL ? undefined : activeTab.toLowerCase(),
    page,
    limit,
    search,
  });
  const { mutate: deleteContact, isPending: isLoading } = useDeleteContact();

  console.log("contacts:", contacts);
  return (
    <div className="w-full flex-col flex gap-8">
      <div className="flex max-md:flex-col max-md:gap-5 max-md:items-start items-center justify-between w-full">
        <div className="border bg-[#FFF3E6] xl:w-lg md:w-sm w-full rounded-full text-[#3A2418] flex flex-row items-center gap-2 py-3 px-3">
          <Search color="#3A2418" size={20} />
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
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
              } flex flex-row items-center cursor-pointer xl:text-base text-sm font-normal capitalize gap-2 py-2 ${
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
        {!isPending && contacts?.data.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              No companies yet
            </span>
            <CustomDrawer
              label="Add Company"
              trigger={
                <CustomButton
                  variant="default"
                  className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
                >
                  <span>Add your first contact</span>
                </CustomButton>
              }
            >
              {(close) => <AddContactForm onSuccess={close} />}
            </CustomDrawer>
          </div>
        )}

        {/* Contacts list */}
        {!isPending && !isError && contacts && contacts.data.length > 0 && (
          <div className="w-full">
            <div className="border border-[#F3D9C4] rounded-t-[12px]">
              {contacts.data.map((contact, index) => (
                <CustomDrawer
                  key={index}
                  label="Contact Details"
                  trigger={
                    <div
                      className="grid grid-cols-5 lg:gap-4 gap-1 w-full p-4 items-center border-b last:border-b-0 cursor-pointer"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex col-span-2 items-center gap-4 flex-1">
                        <div className="bg-[#D8F3F1] h-10 w-10 max-md:h-8 max-md:w-8 rounded-full flex items-center justify-center md:text-base text-sm font-medium text-[#2F9E94]">
                          {getInitials(
                            [contact.first_name, contact.last_name]
                              .filter(Boolean)
                              .join(" "),
                          )}
                        </div>
                        <div className="flex flex-col items-start ">
                          <span className="md:text-sm text-xs font-normal">
                            {contact.first_name + " " + contact.last_name}
                          </span>
                          <span className="md:text-sm text-xs font-medium text-foreground">
                            {contact.role_title}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-1">
                        <span className="md:text-sm text-xs font-normal text-foreground">
                          {contact.company_id?.name ?? "-------"}
                        </span>
                      </div>

                      <div className="flex flex-col items-center flex-1">
                        <span className="md:text-sm text-xs truncate font-normal text-foreground">
                          {handleTime(contact.created_at)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div
                          className={`px-3 py-1 flex max-md:justify-center rounded-full md:text-sm text-xs self-auto font-medium ${
                            contact.temperature === ContactTabs.HOT
                              ? "bg-[#E6F7F1] text-[#2CA678]"
                              : contact.temperature === ContactTabs.WARM
                                ? "bg-[#FFF6EC] text-[#E2725B]"
                                : "bg-[#F3D9C4] text-[#E2725B]"
                          }`}
                        >
                          <span className="md:text-sm text-xs font-normal self-center text-foreground">
                            {contact.temperature}
                          </span>
                        </div>
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
            <div className="border border-t-0 border-[#F3D9C4] rounded-b-[12px] px-4 py-3">
              <CustomPagination
                page={page}
                totalPages={contacts.total_pages}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )}

        {/* Filtered empty state */}
        {!isPending && !isError && contacts?.data.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              {activeTab === "All"
                ? "No contacts yet"
                : `No ${activeTab.toLowerCase()} contacts found`}
            </span>
            {activeTab === "All" && (
              <CustomDrawer
                label="Add Contacts"
                trigger={
                  <CustomButton
                    variant="default"
                    className="rounded-full flex flex-row items-center gap-2 px-5 py-2.5"
                  >
                    <span>Add your first contact</span>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
