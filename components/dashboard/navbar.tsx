import Image from "next/image";
import CRMLOGO from "@/public/assets/company/logo.png";
import { getInitials } from "@/lib/utils";
import { Search, Bell } from "lucide-react";
import { useUserProfile } from "@/hooks/user/profile";

export default function Navbar() {
  const { data: user, isPending } = useUserProfile();

  return (
    <div className="xl:px-10 lg:px-8 px-4 bg-white border border-[#e8e8e8] flex justify-between items-center fixed top-0 left-0 right-0 z-50 w-full">
      <Image
        src={CRMLOGO}
        alt="crm_logo"
        width={800}
        height={800}
        className="lg:h-12 h-8 w-auto"
      />
      <div className="border bg-[#FFF3E6] xl:w-lg lg:w-md max-lg:hidden rounded-[16px] text-[#3A2418] flex flex-row items-center gap-2 py-3 px-3">
        <Search color="#3A2418" size={20} />
        <input
          type="text"
          placeholder="Search contacts, deals, companies"
          className="flex-1 placeholder:text-sm h-full outline-0 focus-visible:ring-0"
        />
      </div>
      <div className="flex items-center gap-4.5">
        <div className="p-2.5 border rounded-full">
          <Bell color="#3A2418" size={18} />
        </div>

        {isPending ? (
          // skeleton
          <div className="flex items-center gap-2 p-2 animate-pulse">
            <div className="flex flex-col gap-1.5 items-end">
              <div className="h-3.5 w-28 bg-gray-200 rounded-full" />
              <div className="h-3 w-36 bg-gray-200 rounded-full" />
            </div>
            <div className="bg-gray-200 px-3 py-3 w-10 h-10 rounded-full" />
          </div>
        ) : (
          // real content
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col justify-center gap-1 items-end">
              <span className="text-base/[120%] font-medium capitalize">
                {user?.display_name}
              </span>
              <span className="text-sm/[120%] font-normal">{user?.email}</span>
            </div>
            <div className="bg-[#F5B7A3] px-3 py-3 text-base font-bold text-foreground rounded-full">
              {getInitials(user?.display_name || "").toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
