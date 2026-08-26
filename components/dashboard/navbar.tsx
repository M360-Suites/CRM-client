import Image from "next/image";
import CRMLOGO from "@/public/assets/company/logo.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";
import { Search, Bell, XIcon, CheckCheck } from "lucide-react";
import { CustomPopover } from "../custom/common/custom_notification_popover";
import { useUserProfile } from "@/hooks/user/profile";
import { useGetAllNotifications } from "@/hooks/notification/get_all_noti";
import { useMarkAsReadById } from "@/hooks/notification/mark_as_read_by_id";
import { useMarkAllAsRead } from "@/hooks/notification/mark_all_as_read";
import { formatRelativeDateTime, handleHoursTime } from "@/lib/utils";
import { useState } from "react";

export default function Navbar() {
  const [markingId, setMarkingId] = useState<string | null>(null);
  const { data: user, isPending } = useUserProfile();
  const { data: notifications, isPending: isLoading } =
    useGetAllNotifications();
  const { mutate: markAsRead, isPending: isMarkingAsRead } =
    useMarkAsReadById();
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } =
    useMarkAllAsRead();

  const handleMarkAsRead = (id: string) => {
    setMarkingId(id);
    markAsRead(id);
  };

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
        {/*<div className="border bg-[#FFF3E6] xl:w-lg lg:w-md max-lg:hidden rounded-[16px] text-[#3A2418] flex flex-row items-center gap-2 py-3 px-3">
          <Search color="#3A2418" size={20} />
          <input
            type="text"
            placeholder="Search contacts, deals, companies"
            className="flex-1 placeholder:text-sm h-full outline-0 focus-visible:ring-0"
          />
        </div>*/}
        <div className="flex items-center gap-4.5">
          <CustomPopover
            align="center"
            popoverClassname="shadow-none"
            title="Notification"
            action={
              <button
                onClick={() => {
                  markAllAsRead();
                }}
              >
                {isMarkingAllAsRead
                  ? "Marking all as read..."
                  : "Mark all as read"}
              </button>
            }
            trigger={
              <button className="p-2.5 border rounded-full md:block relative cursor-pointer">
                <Bell color="#3A2418" className="w-4 h-4" />
                {(notifications?.unread_count ?? 0) && (
                  <div className="absolute top-0 -right-2 bg-[#F5B7A3] flex justify-center items-center rounded-full px-1.5 py-0.5">
                    <span className="text-xs text-foreground font-medium">
                      {notifications?.unread_count}
                    </span>
                  </div>
                )}
              </button>
            }
          >
            <div className="w-[300px] max-h-[300px] overflow-y-auto no-scrollbar font-inter">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {notifications?.data && notifications.data.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {notifications.data.map((notification) => (
                        <div
                          key={notification._id}
                          className="border-b border-foreground/10 last:border-b-0 pb-2 flex flex-col gap-2 hover:bg-gray-50/40 px-1 pt-1"
                        >
                          <span className="text-xs text-foreground/95 font-medium">
                            {notification.title}
                          </span>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px]/[100%] font-medium text-foreground/70">
                              {formatRelativeDateTime(notification.created_at)}
                            </span>
                            <span className="text-[10px]/[100%] font-medium text-foreground/70">
                              {handleHoursTime(notification.created_at)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 pl-2.5">
                            <span className="text-foreground/90 text-xs p-2.5 bg-[#F5B7A3]/10 border-l-2 border-[#C95C47] rounded-r-md">
                              {notification.metadata.preview}
                            </span>
                            <div className="flex items-center justify-end">
                              {notification.read === true ? (
                                <div className="flex items-center gap-0.5">
                                  <CheckCheck
                                    size={10}
                                    className="text-foreground/60"
                                  />
                                  <span className="text-[10px] text-foreground/60">
                                    read
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className="text-[10px] text-foreground/60 hover:bg-foreground/20 p-1.5 hover:rounded-sm hover:cursor-pointer hover:text-foreground"
                                  onClick={() =>
                                    handleMarkAsRead(notification._id)
                                  }
                                >
                                  {isMarkingAsRead &&
                                  notification._id === markingId
                                    ? "marking as read..."
                                    : "mark as read"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No notifications</div>
                  )}
                </div>
              )}
            </div>
          </CustomPopover>

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
