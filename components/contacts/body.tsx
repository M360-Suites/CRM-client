"use client";

import { Search } from "lucide-react";
import { ContactTabs, getIntials } from "@/lib/utils";
import { useContactStore } from "@/stores/contact/contact_store";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import { useState } from "react";

export default function Body() {
  const categoryObjects = Object.values(ContactTabs);
  const categories = [...categoryObjects];
  const { contacts, selectedContact, setSelectedContact } = useContactStore();
  const [activeTab, setActiveTab] = useState(categories[0]);

  const filteredContacts = contacts.filter(
    (contact) =>
      activeTab === "All" ||
      contact.status.toLowerCase() === activeTab.toLowerCase(),
  );

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
              className={`border  ${
                tab === "All" ? "rounded-full px-5" : "rounded-full px-4"
              }  flex flex-row items-center cursor-pointer text-base font-normal capitalize gap-2 py-2  ${
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
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
            <span className="text-base font-normal text-foreground">
              No contacts yet
            </span>
            <CustomButton className="px-4 py-2 rounded-full">
              <span className="text-sm ">Add your first Contact</span>
            </CustomButton>
          </div>
        ) : (
          <div className="border border-[#F3D9C4] rounded-t-[12px]">
            {filteredContacts.map((contact, index) => (
              <CustomDrawer
                key={index}
                label="Contact Details"
                trigger={
                  <div
                    className="flex flex-row items-center justify-between w-full p-4 border-b last:border-b-0 cursor-pointer"
                    onClick={() => setSelectedContact(contact)} // Set the selected contact
                  >
                    {/* Avatar and Name */}
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <div className="bg-[#D8F3F1] h-10 w-10 rounded-full flex items-center justify-center text-base font-medium text-[#2F9E94]">
                        {getIntials(contact.name)}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-normal">
                          {contact.name}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {contact.role}
                        </span>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col items-start flex-1">
                      <span className="text-sm font-normal text-foreground">
                        {contact.company}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col items-start flex-1">
                      <span className="text-sm font-normal text-foreground">
                        {contact.date}
                      </span>
                    </div>

                    {/* Status */}
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        contact.status === ContactTabs.HOT
                          ? "bg-[#E6F7F1] text-[#2CA678]"
                          : contact.status === ContactTabs.WARM
                            ? "bg-[#FFF6EC] text-[#E2725B]"
                            : "bg-[#F3D9C4] text-[#E2725B]"
                      }`}
                    >
                      <span className="text-sm font-normal text-foreground">
                        {contact.status}
                      </span>
                    </div>
                  </div>
                }
              >
                {/* Drawer Content */}
                <div className="p-4">
                  <h2 className="text-lg font-medium text-foreground">
                    {selectedContact?.name}
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Email: {selectedContact?.email}
                  </p>
                  <p className="text-sm text-foreground/70">
                    Phone: {selectedContact?.phone}
                  </p>
                  <p className="text-sm text-foreground/70">
                    Company: {selectedContact?.company}
                  </p>
                  <p className="text-sm text-foreground/70">
                    Role: {selectedContact?.role}
                  </p>
                  <p className="text-sm text-foreground/70">
                    Status: {selectedContact?.status}
                  </p>
                </div>
              </CustomDrawer>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
