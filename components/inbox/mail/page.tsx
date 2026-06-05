import { CustomButton } from "@/components/custom/common/customButton";
import { useGmailAuth } from "@/hooks/gmail/gmail_auth";
import { Mail, Send, Tags, Loader } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Permissions = [
  {
    label: "Read your mail",
    icon: Mail,
  },
  {
    label: "Send mails on your behalf",
    icon: Send,
  },
  {
    label: "Manage labels",
    icon: Tags,
  },
];

export default function MailAuthorisation() {
  const { mutate, isPending } = useGmailAuth();
  return (
    <div className="flex flex-col gap-4">
      <p>We&apos;ll redirect you to Google to approve these permissions</p>
      <div className="p-4 border flex flex-col gap-6 border-[#e8e8e8] rounded-xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFF6EC] p-3.5 rounded-lg">
              <FcGoogle className="text-2xl" />
            </div>
            <div>
              <span className="text-base font-medium text-foreground">
                Google Gmail
              </span>
            </div>
          </div>
          <p className="uppercase text-base font-medium text-foreground">
            Permission Requested
          </p>
        </div>
        <div className="flex flex-col gap-4 ">
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
