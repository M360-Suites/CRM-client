import { useUserProfile } from "@/hooks/user/profile";
import { getInitials } from "@/lib/utils";

export default function Profile() {
  const { data: profile, isPending: isProfileFetching } = useUserProfile();

  const UserData = [
    { label: "Name", value: profile?.display_name },
    { label: "Email", value: profile?.email },
    { label: "Role", value: profile?.role || "N/A" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3 font-inter">
      <span className="text-foreground font-medium text-base tracking-tight">
        My Account
      </span>
      <div className=" flex items-center justify-start w-xl px-2">
        {isProfileFetching ? (
          // skeleton that matches the real layout
          <div className="flex flex-col items-start md:gap-4 gap-1 w-full h-full animate-pulse">
            {/* <div className="h-6 bg-gray-200 rounded w-44 mb-2" aria-hidden /> */}
            <div
              className="bg-gray-200 flex justify-center shrink-0 items-center md:h-20 md:w-20 h-60 w-60 rounded-lg"
              aria-hidden
            />
            <div className="flex flex-col w-full border rounded-lg mt-4">
              <div className="bg-[#fff3e6] rounded-lg flex flex-col gap-3 py-4 w-full px-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // real content
          <div className="flex flex-col items-start md:gap-4 gap-1 w-full h-full ">
            <div className="bg-[#F5B7A3] flex justify-center shrink-0 items-center md:h-20 md:w-20  lg:text-3xl text-sm font-semibold text-foreground rounded-lg">
              {getInitials(profile?.display_name).toUpperCase()}
            </div>
            <div className="flex flex-col w-full border  rounded-lg">
              <div className="bg-[#fff3e6] rounded-lg flex flex-col gap-3 py-4 w-full px-4">
                {UserData.map((item, index) => (
                  <div
                    key={index}
                    className="w-full flex items-center justify-between"
                  >
                    <h4 className="text-sm text-foreground/80 font-medium">
                      {item.label}
                    </h4>
                    <p className="text-sm font-medium text-foreground">
                      {item.value || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
