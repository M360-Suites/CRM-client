"use client";

import { getInitials } from "@/lib/utils";
import { MoreVerticalIcon } from "lucide-react";
import { useDashboard } from "@/hooks/user/dashboard";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { toUTC } from "@/lib/utils";
import Link from "next/link";

const TableData = [
  {
    name: "Sarah Johnson",
    company: "Acne.com",
    date: "May 11, 2026",
  },
  {
    name: "Micheal Brown",
    company: "Acne.com",
    date: "May 11, 2026",
  },
  {
    name: "Emily Watson",
    company: "Acne.com",
    date: "May 11, 2026",
  },
  {
    name: "David Turner",
    company: "Acne.com",
    date: "May 11, 2026",
  },
];

export default function DashTable() {
  const { data: dashboard } = useDashboard();
  return (
    <div className="p-6 border border-[#E8E8E8] rounded-[12px]">
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
          {dashboard?.recent_contacts.map((data) => (
            <div
              key={data.id}
              className="flex justify-between items-center py-4 px-4 border-b border-[#E8E8E8]"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-[#D8F3F1] text-[#2F9E94]">
                  {getInitials(data.full_name)}
                </div>
                <div>
                  <span className="block text-sm font-medium text-foreground capitalize">
                    {data.full_name}
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-sm text-foreground">
                  {data.company}
                </span>
              </div>
              <div>
                <span className="text-sm text-foreground">
                  {toUTC(data.created_at)}
                </span>
              </div>
              <div>
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
          ))}
        </div>
      </div>
    </div>
  );
}
