"use client";

import { CustomButton } from "../custom/common/customButton";
import { CustomSelect } from "../custom/common/customSelect";
import CustomInput from "../custom/common/customInput";
import { DraftSkeleton } from "./skeleton/email_skelton";
import { Sparkles, Copy, Link, XIcon, Loader } from "lucide-react";
import { getInitials, parseEmailResponse } from "@/lib/utils";
import { useGetContacts } from "@/hooks/contact/get_contacts";
import { useGetDeals } from "@/hooks/pipeline/get_deals";
import useGenerateDraft from "@/hooks/user/generate";
import { useForm, Controller } from "react-hook-form";

const toneOptions = [
  { name: "Friendly", value: "friendly" },
  { name: "Professional", value: "professional" },
  { name: "Follow-up", value: "follow-up" },
  { name: "Cold outreach", value: "cold-outreach" },
  { name: "Thank you", value: "thank-you" },
];

// const deals = [
//   {
//     id: "6a1866fb59bdd6dda147e376",
//     title: "Foreign",
//     value: 1000000,
//     source: "Direct",
//     industry: "Sport and Entertainment",
//     stage_id: "6a1418562d97d3a048c363fc",
//     company: null,
//     stage_changed_at: "2026-05-28T16:02:08.934Z",
//     created_at: "2026-05-28T16:02:03.386Z",
//     updated_at: "2026-05-28T16:02:08.934Z",
//   },
//   {
//     id: "6a18662459bdd6dda147e375",
//     title: "Locals",
//     value: 400000,
//     source: "Direct",
//     industry: "Food & Hospitality",
//     stage_id: "6a1418562d97d3a048c36400",
//     company: null,
//     stage_changed_at: "2026-05-29T14:31:19.113Z",
//     created_at: "2026-05-28T15:58:28.541Z",
//     updated_at: "2026-05-29T14:31:19.114Z",
//   },
//   {
//     id: "6a183196200c673bc7b53d3e",
//     title: "Buy Olu Food",
//     value: 3000,
//     source: "Direct",
//     industry: "Food & Hospitality",
//     stage_id: "6a1418562d97d3a048c363fb",
//     company: null,
//     stage_changed_at: "2026-05-28T16:00:44.493Z",
//     created_at: "2026-05-28T12:14:14.129Z",
//     updated_at: "2026-05-28T16:00:44.493Z",
//   },
//   {
//     id: "6a183100200c673bc7b53d3d",
//     title: "Buying Olu a camera",
//     value: 400000,
//     source: "Direct",
//     industry: "Entertainment",
//     stage_id: "6a1418562d97d3a048c363ff",
//     company: null,
//     stage_changed_at: "2026-05-28T16:03:11.948Z",
//     created_at: "2026-05-28T12:11:44.693Z",
//     updated_at: "2026-05-28T16:03:11.948Z",
//   },
//   {
//     id: "6a15f6bbca614cae7f89c790",
//     title: "Arsenal Billboard Deal",
//     value: 1000000,
//     source: "Direct",
//     industry: "Sport and Entertainment",
//     stage_id: "6a1418562d97d3a048c363fd",
//     company: null,
//     stage_changed_at: "2026-05-28T16:01:17.190Z",
//     created_at: "2026-05-26T19:38:35.991Z",
//     updated_at: "2026-05-28T16:01:17.191Z",
//   },
//   {
//     id: "6a15f5d3ca614cae7f89c78f",
//     title: "Barcelona Advertisment Deal",
//     value: 800000,
//     source: "Direct",
//     industry: "Sports and Entertainment",
//     stage_id: "6a1418562d97d3a048c363fe",
//     company: null,
//     stage_changed_at: "2026-05-29T10:37:31.220Z",
//     created_at: "2026-05-26T19:34:43.645Z",
//     updated_at: "2026-05-29T10:37:31.220Z",
//   },
//   {
//     id: "6a15f5b4ca614cae7f89c78e",
//     title: "Barcelona Advertisment Deal",
//     value: 800000,
//     source: "Direct",
//     industry: "Sports and Entertainment",
//     stage_id: "6a1418562d97d3a048c363fe",
//     company: null,
//     stage_changed_at: "2026-05-28T16:02:57.980Z",
//     created_at: "2026-05-26T19:34:12.266Z",
//     updated_at: "2026-05-28T16:02:57.980Z",
//   },
//   {
//     id: "6a15f5b4ca614cae7f89c78d",
//     title: "Barcelona Advertisment Deal",
//     value: 800000,
//     source: "Direct",
//     industry: "Sports and Entertainment",
//     stage_id: "6a1418562d97d3a048c363fc",
//     company: null,
//     stage_changed_at: "2026-05-28T16:02:10.454Z",
//     created_at: "2026-05-26T19:34:12.128Z",
//     updated_at: "2026-05-28T16:02:10.454Z",
//   },
//   {
//     id: "6a15f5b4ca614cae7f89c78c",
//     title: "Barcelona Advertisment Deal",
//     value: 800000,
//     source: "Direct",
//     industry: "Sports and Entertainment",
//     stage_id: "6a1418562d97d3a048c363ff",
//     company: null,
//     stage_changed_at: "2026-05-29T10:34:40.064Z",
//     created_at: "2026-05-26T19:34:12.124Z",
//     updated_at: "2026-05-29T10:34:40.065Z",
//   },
// ];

const lengthOptions = [
  { name: "Short", value: "short" },
  { name: "Medium", value: "medium" },
  { name: "Detailed", value: "detailed" },
];

const Options = [
  {
    label: "Copy",
    icon: Copy,
  },
  {
    label: "Attachment",
    icon: Link,
  },
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
  const isLoading = false;

  const { control, handleSubmit, setValue, watch } = useForm<EmailFormValues>({
    defaultValues: {
      contactId: "",
      dealId: "",
      tone: "",
      length: "",
      notes: "",
    },
  });

  console.log("Deals:", deals);

  const selectedTone = watch("tone");
  const selectedLength = watch("length");
  const selectedContactId = watch("contactId");
  const selectedContact =
    contacts?.find((c) => c._id === selectedContactId) ?? null;

  // safe parse of a known-good JSON string for demo / fallback
  let generatedBody: string | undefined;
  try {
    const parsed = parseEmailResponse(
      JSON.stringify({
        subject: "Quick Follow-Up on Our Recent Discussion",
        body: 'Hi [Name],\\n\\nJust following up on our recent discussion about [topic] and wanted to see if you had any questions. Let me know if you\'d like to schedule a quick call to move things forward.\\n\\nThanks,\\nOjo Daniel"} Ensure valid JSON with escaped newlines.\n\nLet\'s produce.\n{"subject":"Quick check‑in on our last chat","body":"Hi [Name],\\n\\nJust following up on our recent discussion about [topic] and wanted to see if you had any questions. Let me know if you\'d like to schedule a quick call to move things forward.\\n\\nThanks,\\nOjo Daniel',
      }),
    );
    generatedBody = parsed?.body;
  } catch (err) {
    console.warn("parseEmailResponse failed:", err);
  }

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
    console.log("form values:", values);
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
      {isLoading ? (
        <DraftSkeleton />
      ) : (
        <div className="flex flex-col gap-4 border border-[#E8E8E8] rounded-[12px] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base text-[#3A2418] font-medium">
                Draft
              </span>
              <span className="bg-[#c6f7dc] border border-[#43f897] rounded-full py-1 px-2 text-[10px] text-[#128648] font-semibold">
                AI Generated
              </span>
            </div>
            <div className="flex items-center gap-2">
              {Options.map((item, index) => (
                <div key={index} className="flex items-center gap-2 ">
                  <item.icon size={16} color={"#F5B7A3"} />
                  <span className="text-sm text-[#4A4A4A] font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-y flex items-center gap-2">
            <span className="text-foreground text-base font-medium">To:</span>
            <div className="py-2">
              {selectedContact && (
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
                  <span className="">{`<${selectedContact.email}>`}</span>
                  <button className="p-2 cursor-pointer">
                    <XIcon size={16} color="#F5B7A3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border-b flex items-center gap-2 pb-2">
            <span className="text-foreground text-base font-medium">
              Subject:
            </span>
            <span className="text-sm text-foreground">
              Introducing our new pricing tier for your team
            </span>
          </div>
          <div className="text-foreground text-sm whitespace-pre-line">
            {generatedBody ??
              "No draft available. Select a contact / generate to see the mail here."}
          </div>
        </div>
      )}
    </div>
  );
}
