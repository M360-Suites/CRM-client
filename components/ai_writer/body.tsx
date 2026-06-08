"use client";

import { useEffect, useState } from "react";
import { CustomButton } from "../custom/common/customButton";
import { CustomSelect } from "../custom/common/customSelect";
import CustomInput from "../custom/common/customInput";
import { Sparkles, XIcon, Loader, Send } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useGetContacts } from "@/hooks/contact/get_contacts";
import { useGetDeals } from "@/hooks/pipeline/get_deals";
import useSendGmail from "@/hooks/gmail/send_gmail";
import useGenerateDraft from "@/hooks/user/generate";
import { useForm, Controller } from "react-hook-form";
import CustomEmailArea from "../custom/common/customEmailTextArea";
import AttachmentUpload from "../ai_writer/attachment_file";
import { SendMailRequest } from "@/types/gmail";

const toneOptions = [
  { name: "Friendly", value: "friendly" },
  { name: "Professional", value: "professional" },
  { name: "Follow-up", value: "follow_up" },
  { name: "Cold outreach", value: "cold_outreach" },
  { name: "Thank you", value: "thank_you" },
];

const lengthOptions = [
  { name: "Short", value: "short" },
  { name: "Medium", value: "medium" },
  { name: "Detailed", value: "detailed" },
];

interface EmailFormValues {
  contactId: string;
  dealId: string;
  tone: string;
  length: string;
  notes: string;
}

interface SendFormValues {
  to: string;
  subject: string;
  body: string;
}

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function Body() {
  const { mutate: generateMail, data: mail, isPending } = useGenerateDraft();
  const { mutate: sendMail, isPending: isSending } = useSendGmail();
  const { data: contacts } = useGetContacts({});
  const { data: deals } = useGetDeals();

  const [attachments, setAttachments] = useState<File[]>([]);

  const { control, handleSubmit, setValue, watch } = useForm<EmailFormValues>({
    defaultValues: {
      contactId: "",
      dealId: "",
      tone: "",
      length: "",
      notes: "",
    },
  });

  const {
    handleSubmit: handleSendSubmit,
    setValue: setSendValue,
    watch: watchSend,
  } = useForm<SendFormValues>({
    defaultValues: {
      to: "",
      subject: "",
      body: "",
    },
  });

  useEffect(() => {
    if (mail?.data?.subject) setSendValue("subject", mail.data.subject);
    if (mail?.data?.body) setSendValue("body", mail.data.body);
  }, [mail]);

  const selectedTone = watch("tone");
  const selectedLength = watch("length");
  const selectedContactId = watch("contactId");
  const selectedContact =
    contacts?.data.find((c) => c._id === selectedContactId) ?? null;

  const handleRemoveContact = () => setValue("contactId", "");

  const contactData =
    contacts?.data?.map((c) => ({
      name: `${c.first_name} ${c.last_name}`,
      value: c._id,
    })) ?? [];

  const dealData =
    deals?.map((d) => ({
      name: d.title,
      value: d.id,
    })) ?? [];

  const canSend =
    !isSending && (!!selectedContact?.email || isValidEmail(watchSend("to")));

  const onGenerate = (values: EmailFormValues) => {
    generateMail(values);
  };

  const onSend = () => {
    const values = watchSend();
    const recipient = selectedContact?.email || values.to;
    if (!recipient) return;

    if (attachments.length > 0) {
      const formData = new FormData();
      formData.append("to", recipient);
      formData.append("subject", values.subject);
      formData.append("body", values.body);
      if (selectedContactId) formData.append("contactId", selectedContactId);
      attachments.forEach((file) => formData.append("attachments", file));

      sendMail(formData as unknown as SendMailRequest, {
        onSuccess: () => {
          setTimeout(() => {
            // reset send form
            setSendValue("to", "");
            setSendValue("subject", "");
            setSendValue("body", "");
            // reset generate form
            setValue("contactId", "");
            setValue("dealId", "");
            setValue("tone", "");
            setValue("length", "");
            setValue("notes", "");
            // clear attachments
            setAttachments([]);
          }, 1000);
        },
      });
    } else {
      sendMail(
        {
          to: recipient,
          subject: values.subject,
          body: values.body,
          contactId: selectedContactId || undefined,
        } as SendMailRequest,
        {
          onSuccess: () => {
            // reset send form
            setSendValue("to", "");
            setSendValue("subject", "");
            setSendValue("body", "");
            // reset generate form
            setValue("contactId", "");
            setValue("dealId", "");
            setValue("tone", "");
            setValue("length", "");
            setValue("notes", "");
            // clear attachments (no-op here but keep consistent)
            setAttachments([]);
          },
        },
      );
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Generate form */}
      <form
        onSubmit={handleSubmit(onGenerate)}
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
          <span>{isPending ? "Generating" : "Generate draft"}</span>
        </CustomButton>
      </form>

      {/* Send form */}
      <form
        // onSubmit={handleSendSubmit(onSend)}
        className="flex flex-col gap-4 border border-[#E8E8E8] rounded-[12px] p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#3A2418] font-medium">Draft</span>
            <span className="bg-[#c6f7dc] border border-[#43f897] rounded-full py-1 px-2 text-[10px] text-[#128648] font-semibold">
              AI Generated
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Attachment trigger only — list renders below body */}
            <AttachmentUpload onFilesChange={setAttachments} triggerOnly />
            <button
              type="button"
              disabled={!canSend}
              onClick={onSend}
              className="flex items-center bg-[#FFD9C0] px-3 py-1.5 rounded-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <Loader size={16} color="#4a4a4a" className="animate-spin" />
              ) : (
                <Send size={16} color="#4a4a4a" />
              )}
              <span className="text-sm text-[#4A4A4A] font-medium">
                {isSending ? "Sending" : "Send"}
              </span>
            </button>
          </div>
        </div>

        {/* To */}
        <div className="border-y flex items-center gap-2 py-2">
          <span className="text-foreground text-base font-medium">To:</span>
          {selectedContact ? (
            <div className="border rounded-full p-1 text-sm text-[#4A4A4A] font-medium flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full text-[#FF9E55] bg-[#FFE7D5] w-9 h-9 flex items-center justify-center text-xs font-medium">
                  {getInitials(
                    `${selectedContact.first_name} ${selectedContact.last_name}`,
                  )}
                </div>
                <span>
                  {selectedContact.first_name + " " + selectedContact.last_name}
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
            <CustomEmailArea
              kind="to"
              body={watchSend("to")}
              onChange={(value) => setSendValue("to", value)}
              placeholder="Enter recipient email"
            />
          )}
        </div>

        {/* Subject */}
        <div className="border-b flex items-center gap-2 pb-2">
          <span className="text-foreground text-base font-medium">
            Subject:
          </span>
          {isPending ? (
            <div className="h-6 w-3/4 rounded bg-[#E8E8E8] animate-pulse" />
          ) : (
            <CustomEmailArea
              kind="subject"
              body={watchSend("subject")}
              onChange={(value) => setSendValue("subject", value)}
              placeholder="Subject of the mail"
            />
          )}
        </div>

        {/* Body */}
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
              body={watchSend("body")}
              placeholder="Write your email here..."
              onChange={(value) => setSendValue("body", value)}
            />
          )}
        </div>

        {/* Attached files list — always visible below body */}
        {attachments.length > 0 && (
          <AttachmentUpload
            onFilesChange={setAttachments}
            listOnly
            files={attachments}
          />
        )}
      </form>
    </div>
  );
}
