import { CustomButton } from "@/components/custom/common/customButton";
import { useWhatsappAuth } from "@/hooks/gmail/whatsapp_auth";
import { Mail, Send, Loader } from "lucide-react";
import { useGmailStore } from "@/stores/gmail/gmail_store";
import { useGmailStatus } from "@/hooks/gmail/gmail_connect_status";
import { useSearchParams } from "next/navigation";
import { IoLogoWhatsapp } from "react-icons/io5";
import { useEffect } from "react";

const Permissions = [
  {
    label: "Read your chats",
    icon: Mail,
  },
  {
    label: "Send chats on your behalf",
    icon: Send,
  },
];

export default function WhatsappAuthorisation() {
  const searchParams = useSearchParams();
  const { mutate, isPending } = useWhatsappAuth();
  const { setConnectedChannels } = useGmailStore();
  const { isPending: isStatusPending, data } = useGmailStatus();
  const channel = searchParams?.get("channel");
  const status = searchParams?.get("connected");

  useEffect(() => {
    if (channel && status) {
      setConnectedChannels([
        {
          id: channel,
          label: "Google Gmail",
          connected: (status as string) === "true",
        },
      ]);
    }
  }, [channel, status, setConnectedChannels]);

  return (
    <div className="flex flex-col gap-4">
      <p>We&apos;ll redirect you to Google to approve these permissions</p>
      <div className="p-4 border flex flex-col gap-3 border-[#e8e8e8] rounded-xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFF6EC] p-3.5 rounded-lg">
              <IoLogoWhatsapp className="text-2xl text-[#075E54]" />
            </div>
            <div>
              <span className="text-base font-medium text-foreground">
                Whatsapp
              </span>
            </div>
          </div>
          <p className="uppercase text-base font-medium text-foreground">
            Permission Requested
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {Permissions.map(({ label, icon: Icon }) => (
            <div
              className="flex items-center gap-3 border-b py-5 border-[#e8e8e8] last:border-b-0"
              key={label}
            >
              <div className="">
                <Icon className="text-xl text-[#4A4A4A]" />
              </div>
              <div>
                <span className="text-base font-medium text-foreground">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-5 mt-8">
        <CustomButton
          className="py-5 w-full"
          disabled={isPending}
          onClick={() => mutate()}
        >
          {isPending && <Loader className="animate-spin" />}
          Authorize
        </CustomButton>
      </div>
    </div>
  );
}
