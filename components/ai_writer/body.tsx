"use client";

import { CustomButton } from "../custom/common/customButton";
import { CustomSelect } from "../custom/common/customSelect";
import CustomInput from "../custom/common/customInput";
import { Sparkles, Link, XIcon, Loader, Send } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useGetContacts } from "@/hooks/contact/get_contacts";
import { useGetDeals } from "@/hooks/pipeline/get_deals";
import useGenerateDraft from "@/hooks/user/generate";
import { useForm, Controller } from "react-hook-form";
import CustomEmailArea from "../custom/common/customEmailTextArea";

const toneOptions = [
  { name: "Friendly", value: "friendly" },
  { name: "Professional", value: "professional" },
  { name: "Follow-up", value: "follow-up" },
  { name: "Cold outreach", value: "cold-outreach" },
  { name: "Thank you", value: "thank-you" },
];

const lengthOptions = [
  { name: "Short", value: "short" },
  { name: "Medium", value: "medium" },
  { name: "Detailed", value: "detailed" },
];

const Options = [
  { label: "Attachment", icon: Link },
  { label: "Send", icon: Send },
];

interface EmailFormValues {
  contactId: string;
  dealId: string;
  tone: string;
  length: string;
  notes: string;
}

export default function Body() {
  const { mutate: generateMail, data: mail, isPending } = useGenerateDraft();
  const { data: contacts } = useGetContacts();
  const { data: deals } = useGetDeals();

  const { control, handleSubmit, setValue, watch } = useForm<EmailFormValues>({
    defaultValues: {
      contactId: "",
      dealId: "",
      tone: "",
      length: "",
      notes: "",
    },
  });

  const selectedTone = watch("tone");
  const selectedLength = watch("length");
  const selectedContactId = watch("contactId");
  const selectedContact =
    contacts?.find((c) => c._id === selectedContactId) ?? null;

  const handleRemoveContact = () => {
    // clear the selected contact in the form
    setValue("contactId", "");
  };

  const contactData =
    contacts?.map((c) => ({
      name: `${c.first_name} ${c.last_name}`,
      value: c._id,
    })) ?? [];

  const dealData =
    deals?.map((d) => ({
      name: d.title,
      value: d.id,
    })) ?? [];

  const onSubmit = (values: EmailFormValues) => {
    generateMail(values);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 border border-[#E8E8E8] rounded-[12px] p-5"
      >
        <div className="flex flex-col gap-4">
          <Controller
            name="contactId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Contact (optional)"
                placeholder="Select a contact"
                selectable={contactData}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="dealId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Deal (optional)"
                placeholder="Select a deal"
                selectable={dealData}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground font-medium">Tone</h3>
            <div className="flex flex-wrap gap-y-4 gap-x-2">
              {toneOptions.map((item) => (
                <CustomButton
                  type="button"
                  key={item.value}
                  className={`px-6 ${item.value !== selectedTone && "text-foreground"}`}
                  variant={item.value === selectedTone ? "default" : "ghost"}
                  onClick={() => setValue("tone", item.value)}
                >
                  {item.name}
                </CustomButton>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-foreground font-medium">Length</h3>
            <div className="w-full flex justify-between gap-4 items-center">
              {lengthOptions.map((item) => (
                <CustomButton
                  type="button"
                  key={item.value}
                  className={`flex-1 ${item.value !== selectedLength && "text-foreground"}`}
                  variant={item.value === selectedLength ? "default" : "ghost"}
                  onClick={() => setValue("length", item.value)}
                >
                  {item.name}
                </CustomButton>
              ))}
            </div>
          </div>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <CustomInput
                textArea
                label="Additional notes (optional)"
                placeholder="Add a note..."
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <CustomButton
          type="submit"
          disabled={isPending}
          className="rounded-full py-3.5"
        >
          {isPending ? <Loader className="animate-spin" /> : <Sparkles />}
          <span>{isPending ? "Generating" : "Generate Drafts"}</span>
        </CustomButton>
      </form>

      <div className="flex flex-col gap-4 border border-[#E8E8E8] rounded-[12px] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#3A2418] font-medium">Draft</span>
            <span className="bg-[#c6f7dc] border border-[#43f897] rounded-full py-1 px-2 text-[10px] text-[#128648] font-semibold">
              AI Generated
            </span>
          </div>
          <div className="flex items-center gap-4">
            {Options.map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-1 ${item.label === "Send" && "bg-[#FFD9C0] px-3 py-1.5 rounded-full cursor-pointer gap-2"}`}
              >
                <item.icon
                  size={16}
                  color={item.label === "Send" ? "#4a4a4a" : "#F5B7A3"}
                />
                <span className="text-sm text-[#4A4A4A] font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-y flex items-center gap-2">
          <span className="text-foreground text-base font-medium">To:</span>
          <div className="py-3">
            {selectedContact ? (
              <div className="border rounded-full p-1 text-sm text-[#4A4A4A] font-medium flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full text-[#FF9E55] bg-[#FFE7D5] w-9 h-9 flex items-center justify-center text-xs font-medium">
                    {getInitials(
                      `${selectedContact.first_name} ${selectedContact.last_name}`,
                    )}
                  </div>
                  <span>
                    {selectedContact.first_name +
                      " " +
                      selectedContact.last_name}
                  </span>
                </div>
                <span>{`<${selectedContact.email}>`}</span>
                <button
                  type="button"
                  className="p-2 cursor-pointer"
                  onClick={handleRemoveContact}
                >
                  <XIcon size={16} color="#F5B7A3" />
                </button>
              </div>
            ) : (
              <span className="text-foreground text-sm h-10">
                Select a contact or enter email
              </span>
            )}
          </div>
        </div>

        <div className="border-b flex items-center gap-2 pb-2">
          <span className="text-foreground text-base font-medium">
            Subject:
          </span>
          {isPending ? (
            <div className="h-6 w-3/4 rounded bg-[#E8E8E8] animate-pulse" />
          ) : (
            <CustomEmailArea
              kind="subject"
              body={mail?.data?.subject}
              onChange={(value) => console.log(value)}
              placeholder="Subject of the mail"
            />
          )}
        </div>

        <div className="text-foreground text-sm whitespace-pre-line">
          {isPending ? (
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-[#E8E8E8] animate-pulse" />
              <div className="h-3 w-full rounded bg-[#E8E8E8] animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-[#E8E8E8] animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-[#E8E8E8] animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-[#E8E8E8] animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-[#E8E8E8] animate-pulse" />
            </div>
          ) : (
            <CustomEmailArea
              kind="body"
              body={mail?.data?.body ?? ""}
              onChange={(value) => console.log(value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
