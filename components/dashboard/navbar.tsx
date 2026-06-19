import Image from "next/image";
import CRMLOGO from "@/public/assets/company/logo.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";
import { Search, Bell } from "lucide-react";
import { useUserProfile } from "@/hooks/user/profile";

export default function Navbar() {
  const { data: user, isPending } = useUserProfile();

  return (
    <div className="fixed  top-0 z-50 xl:px-10 lg:px-8 px-4 w-full md:py-1 py-1.5 flex items-center gap-3 border border-[#e8e8e8] bg-white ">
      <SidebarTrigger className="inline lg:hidden" />
      <div className="flex justify-between max-lg:justify-end items-center w-full">
        <Image
          src={CRMLOGO}
          alt="crm_logo"
          width={800}
          height={800}
          className="lg:h-12 md:h-11 h-9.5 w-auto max-lg:hidden"
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
          <div className="p-2.5 border rounded-full md:block hidden">
            <Bell
              color="#3A2418"
              className="md:h-4 md:w-4 sm:w-3.5 sm:h-3.5 "
            />
          </div>

          {isPending ? (
            // skeleton
            <div className="flex items-center gap-2 p-2 animate-pulse">
              <div className="flex flex-col gap-1.5 items-end">
                <div className="h-3.5 lg:w-28 w-10 bg-gray-200 rounded-full" />
                <div className="h-3 lg:w-36 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="bg-gray-200 px-3 py-3 md:h-10 md:w-10 h-8 w-8 rounded-full" />
            </div>
          ) : (
            // real content
            <div className="flex items-center md:gap-2 gap-1 p-2">
              <div className="flex flex-col justify-center md:gap-1 gap-0.5 items-end">
                <span className="md:text-base/[120%]  text-sm font-medium capitalize">
                  {user?.display_name}
                </span>
                <span className="sm:text-sm/[120%] text-xs font-normal">
                  {user?.email}
                </span>
              </div>
              <div className="bg-[#F5B7A3] flex justify-center items-center md:h-10 md:w-10 h-9.5 w-9.5 lg:text-base text-sm font-bold text-foreground rounded-full">
                {getInitials(user?.display_name || "").toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
