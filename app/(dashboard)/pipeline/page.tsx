import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/pipeline/header";
import Body from "@/components/pipeline/body";

export const metadata: Metadata = {
  title: "Pipeline | CRM360",
};

function PipelineLoadingFallback() {
  return (
    <div className="grid xl:grid-cols-6 lg:grid-cols-4 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2 max-xs:grid-cols-1 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col border rounded-md flex-1 min-w-0 animate-pulse"
        >
          <div className="border-b p-4 flex flex-col gap-3">
            <div className="h-3.5 w-24 bg-gray-200 rounded-full dark:bg-gray-800" />
            <div className="h-3 w-16 bg-gray-200 rounded-full dark:bg-gray-800" />
          </div>
          <div className="p-2 flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div
                key={j}
                className="h-16 bg-gray-100 rounded-[10px] dark:bg-gray-900"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function page() {
  return (
    <div className="w-full h-full flex flex-col gap-12 pb-8">
      <Header />
      <Suspense fallback={<PipelineLoadingFallback />}>
        <Body />
      </Suspense>
    </div>
  );
}
