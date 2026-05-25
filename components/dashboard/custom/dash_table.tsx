import { Table } from "lucide-react";
import { getInitials } from "@/lib/utils";

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
  return (
    <div className="p-6 border border-[#E8E8E8] rounded-[12px]">
      <div className="border border-[#E8E8E8] bg-[#FAFFFF] rounded-[12px]">
        <div className="flex w-full justify-between items-center py-6 px-4">
          <span>Recent Contacts</span>
          <span className="text-sm text-[#0041FF] font-medium">View all</span>
        </div>
        <div>
          {TableData.map((data) => (
            <div
              key={data.name}
              className="flex justify-between items-center py-4 px-4 border-b border-[#E8E8E8]"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-[#D8F3F1] text-[#2F9E94]">
                  {getInitials(data.name)}
                </div>
                <div>
                  <span className="block text-sm font-medium">{data.name}</span>
                  <span className="block text-xs text-[#A1A1A1]">
                    {data.company}
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#A1A1A1]">{data.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
