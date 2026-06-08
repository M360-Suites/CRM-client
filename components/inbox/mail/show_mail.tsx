import { useGetGmail } from "@/hooks/gmail/get_gmail";
import { useGmailStore } from "@/stores/gmail/gmail_store";
import CustomPagination from "@/components/custom/common/customPagination";
import { Mail } from "lucide-react";

const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value
    .replace(
      /[\u200B-\u200D\uFEFF\u00AD\u034F\u115F\u1160\u17B4\u17B5\u180B-\u180D\u200B\u200C\u200D\u2060\uFEFF]/g,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
};

export default function ShowMail() {
  const { page, limit, setPage, setLimit } = useGmailStore();
  const { data, isLoading } = useGetGmail({ page, limit });

  if (isLoading)
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex flex-col gap-2 border-b border-[#E8E8E8] last:border-b-0 pb-2 px-4 py-2"
            aria-hidden
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
            </div>
            <div>
              <div className="h-4 w-48 rounded bg-gray-200 mb-2" />
              <div className="h-3 w-full rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div>
      <div className="flex flex-col gap-2">
        {data?.data?.map((mail) => (
          <div
            key={mail._id}
            className="flex flex-col gap-0.5 border-b border-b-[#E8E8E8] pb-2"
          >
            <div className="flex items-center gap-2 px-4 py-1">
              <Mail size={18} />
              <span className="font-medium text-sm">{mail.from_name}</span>
            </div>
            <div className="px-4">
              <span className="text-sm font-medium">{mail.subject}</span>
              <p className="text-xs text-muted-foreground">
                {decodeHtml(mail.snippet)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <CustomPagination
        page={page}
        totalPages={data?.total_pages || 1}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
}
