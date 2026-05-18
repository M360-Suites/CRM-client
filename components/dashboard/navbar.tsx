import Image from "next/image";
import CRMLOGO from "@/public/assets/company/logo.png";
import { getIntials } from "@/lib/utils";
import { Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="px-10 bg-white border border-[#e8e8e8] flex flex-row justify-between items-center fixed top-0 left-0 right-0 z-50">
      <Image
        src={CRMLOGO}
        alt="crm_logo"
        width={800}
        height={800}
        className="h-12 w-auto"
      />
      <div className="border bg-[#FFF3E6] w-lg rounded-[16px] text-[#3A2418] flex flex-row items-center gap-2 py-3 px-3">
        <Search color="#3A2418" size={20} />
        <input type="text" placeholder="Search contacts, deals, companies" className="flex-1 placeholder:text-sm h-full outline-0 focus-visible:ring-0" />
      </div>
      <div className="flex flex-row items-center gap-4.5">
        <div className="p-3.5 border rounded-full">
            <Bell color="#3A2418" size={20} />
        </div>
        <div className="flex flex-row items-center gap-2 p-2">
            <div className="flex flex-col justify-center gap-1 items-end">
                <span className="text-base/[120%] font-medium">Ojo Daniel</span>
                <span className="text-sm/[120%] font-normal">ojodanieltoby@gmail.com</span>
            </div>
            <div className="bg-[#F5B7A3] px-3 py-3 text-base font-bold text-foreground rounded-full">
                {getIntials("Ojo Daniel")}
            </div>
        </div>
      </div>
    </div>
  )
}
