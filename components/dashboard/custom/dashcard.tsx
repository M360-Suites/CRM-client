import { Users, TrendingUp, DollarSign, Mail } from "lucide-react";
import { iconCardBg, iconColor } from "@/lib/utils";

const DashData = [
  {
    title: "Open Deals",
    value: "12",
    icon: TrendingUp,
  },
  {
    title: "Revenue Forecast",
    value: "₦12,000,000",
    icon: DollarSign,
  },
  {
    title: "Active Contacts",
    value: "45",
    icon: Users,
  },
  {
    title: "Emails Sent",
    value: "30",
    icon: Mail,
  },
];

const Pipeline = [
  {
    label: "Negotiation",
    value: 6,
    amount: "5,000",
  },
  {
    label: "Lead",
    value: 12,
    amount: "12,000",
  },
  {
    label: "Qualified",
    value: 16,
    amount: "6,100",
  },
  {
    label: "Proposal",
    value: 16,
    amount: "4,200",
  },
  {
    label: "Qualified",
    value: 16,
    amount: "6,100",
  },
];

export default function DashCard() {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-medium text-foreground">
          Good Morning, Oluchuckwu
        </h2>
        <span className="text-base font-normal">
          Here&apos;s how your pipeline looks today.
        </span>
      </div>
      <div className="flex flex-wrap justify-between gap-5">
        {DashData.map((item) => (
          <div className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2">
            <div className="w-64 flex flex-col gap-3">
              <div className="flex flex-row items-center gap-3 py-4">
                <div className={`rounded-full p-2 ${iconCardBg(item.title)}`}>
                  <item.icon size={18} color={iconColor(item.title)} />
                </div>
                <span className="text-base font-medium text-foreground">
                  {item.title}
                </span>
              </div>
              <div className="text-3xl text-foreground">{item.value}</div>
            </div>

            <div className="text-sm flex flex-row items-center gap-1">
              <span>+8%</span>
              <span>vs last 7 days</span>
            </div>
          </div>
        ))}
      </div>
      <div className="py-6 px-5 border border-[#E8E8E8] rounded-lg flex flex-col gap-4">
        <div className="flex w-full justify-between items-center">
          <span>Pipeline Preview</span>
          <span className="text-sm text-[#FF9E55] font-medium">View all</span>
        </div>
        <div className="flex flex-wrap justify-between w-full">
          {Pipeline.map((data) => (
            <div className="bg-[#FAFFFF] border border-[#E8E8E8] py-3.5 px-5 rounded-[12px]">
              <div className="flex flex-col gap-2.5 w-42.5">
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-normal text-foreground">
                    {data.label}
                  </span>
                  <span className="text-3xl font-semibold text-foreground">
                    {data.value}
                  </span>
                </div>
                <span className="text-xs font-normal text-foreground">
                  ${data.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-base font-medium">
            Total Pipeline Value: $31,700{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
