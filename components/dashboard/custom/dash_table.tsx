"use client";

import { getInitials } from "@/lib/utils";
import { MoreVerticalIcon } from "lucide-react";
import { useDashboard } from "@/hooks/user/dashboard";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { toUTC } from "@/lib/utils";
import Link from "next/link";

export default function DashTable() {
  const { data: dashboard } = useDashboard();
  return (
    <div className="lg:p-6 p-4 border border-[#E8E8E8] rounded-[12px]">
      <div className="border border-[#E8E8E8] bg-[#FAFFFF] rounded-[12px]">
        <div className="flex w-full justify-between items-center py-6 px-4">
          <span>Recent Contacts</span>
          <Link
            href="/contacts"
            className="text-sm text-[#0041FF] hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        <div className="">
          {dashboard?.recent_contacts &&
          dashboard.recent_contacts.length > 0 ? (
            dashboard.recent_contacts.map((data) => (
              <div
                key={data.id}
                className="grid grid-cols-3 xl:gap-10 py-4 px-4 border-b border-[#E8E8E8]"
              >
                <div className="flex items-center space-x-4 col-span-2">
                  <div className="p-2 rounded-full bg-[#D8F3F1] text-[#2F9E94]">
                    {getInitials(data.full_name)}
                  </div>
                  <span className="block text-sm font-medium text-foreground capitalize">
                    {data.full_name}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm text-start self-center text-foreground">
                    {toUTC(data.created_at)}
                  </span>
                  <div className="flex justify-end items-center">
                    <CustomPopover trigger={<MoreVerticalIcon size={18} />}>
                      <div className="flex flex-col gap-1 items-start justify-start bg-white min-w-25">
                        <button className="px-2 py-2 w-full border-b border-b-gray-200 cursor-pointer hover:bg-gray-100 rounded-md text-start">
                          Edit
                        </button>
                        <button className="px-2 py-2 w-full hover:bg-gray-100 rounded-md cursor-pointer text-start">
                          Delete
                        </button>
                      </div>
                    </CustomPopover>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 px-6 flex flex-col items-center justify-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">
                No recent contacts
              </span>
              <p className="text-xs text-muted-foreground max-w-xs">
                You don't have any recent contacts yet. Add a contact or view
                all contacts to get started.
              </p>
              <div>
                <Link
                  href="/contacts/new"
                  className="inline-block mt-2 text-sm text-[#0041FF] hover:underline font-medium"
                >
                  Add contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
