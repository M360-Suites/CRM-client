"use client";

import { Fragment, ReactNode } from "react";
import moment from "moment";
import { RefreshCw, Sparkles } from "lucide-react";
import { useAnalyticsAIBreakdown } from "@/hooks/analytics/analytics_ai_breakdown";

type Block =
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

// The breakdown is lightweight markdown: **bold** section titles,
// "- " bullet points and inline **bold** text.
const parseBreakdown = (text: string): Block[] => {
  const blocks: Block[] = [];

  text.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    if (line.startsWith("- ")) {
      const item = line.slice(2).trim();
      const last = blocks[blocks.length - 1];
      if (last?.type === "list") last.items.push(item);
      else blocks.push({ type: "list", items: [item] });
      return;
    }

    // A line that ends with "**" is a section title (the API sometimes drops
    // the opening "**", so it only checks the end).
    if (line.endsWith("**")) {
      blocks.push({ type: "heading", text: line.replace(/\*\*/g, "").trim() });
      return;
    }

    blocks.push({ type: "paragraph", text: line });
  });

  return blocks;
};

const renderInline = (text: string): ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );

export default function AIBreakdown() {
  const { data, isLoading, isFetching, isError, refetch } =
    useAnalyticsAIBreakdown();

  const blocks = data?.breakdown ? parseBreakdown(data.breakdown) : [];

  return (
    <div className="p-4 w-full border border-[#E8E8E8] bg-white rounded-[8px] flex flex-col gap-4">
      <div className="w-full flex items-center flex-row justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <h2 className="md:text-base text-sm font-medium text-foreground">
            AI Breakdown
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {data?.generated_at && (
            <p className="hidden sm:block text-xs text-muted-foreground">
              {data.period && <span className="capitalize">{data.period}</span>}
              {" · "}Generated {moment(data.generated_at).fromNow()}
            </p>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-[6px] border border-[#E8E8E8] hover:bg-[#F5F5F5] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Regenerate AI breakdown"
          >
            <RefreshCw
              className={`w-4 h-4 text-foreground ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse bg-[#E8E8E8]/50 rounded-[4px]"
              style={{ width: `${90 - (i % 3) * 20}%` }}
            />
          ))}
        </div>
      ) : isError || blocks.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-sm text-foreground">No AI breakdown yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground leading-relaxed">
          {blocks.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h3
                  key={i}
                  className="text-sm font-semibold text-foreground mt-2 first:mt-0"
                >
                  {block.text}
                </h3>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={i} className="list-disc pl-5 flex flex-col gap-1">
                  {block.items.map((item, j) => (
                    <li key={j}>{renderInline(item)}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{renderInline(block.text)}</p>;
          })}
        </div>
      )}
    </div>
  );
}
