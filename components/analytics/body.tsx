"use client";

import PipelineByStage from "./analytics_card/pipeline_by_stage";
import PipelineByLead from "./analytics_card/pipeline_by_lead";
import { useAnalyticsLeadSource } from "@/hooks/analytics/analytics_lead_source";
import { useAnalyticsPipelineStage } from "@/hooks/analytics/analytics_pipeline_stage";

export default function Body() {
  const { data: leadSourceData, isLoading: isLeadSourceLoading } =
    useAnalyticsLeadSource();
  const { data: pipelineStageData, isLoading: isPipelineStageLoading } =
    useAnalyticsPipelineStage();

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-6 w-full">
        <div className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2">
          <h2 className="text-base font-medium text-foreground">
            Pipeline by stage
          </h2>
          <div className="flex justify-center items-center h-full">
            {isPipelineStageLoading ? (
              <div className="w-full h-64 animate-pulse bg-[#E8E8E8]/50 rounded-[8px]" />
            ) : pipelineStageData?.length === 0 ? (
              <p className="text-sm text-foreground">
                No pipeline stage data yet
              </p>
            ) : (
              <PipelineByStage />
            )}
          </div>
        </div>
        <div className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2">
          <h2 className="text-base font-medium text-foreground">
            Lead sources
          </h2>
          <div className="flex justify-center items-center h-full">
            {isLeadSourceLoading ? (
              <div className="w-full h-64 animate-pulse bg-[#E8E8E8]/50 rounded-[8px]" />
            ) : leadSourceData?.length === 0 ? (
              <p className="text-sm text-foreground">No lead source data yet</p>
            ) : (
              <PipelineByLead />
            )}
          </div>
        </div>
      </div>
      <div className="p-4 w-full min-h-80 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2">
        <h2 className="text-base font-medium text-foreground">
          Team Productivity
        </h2>
        <div className="flex justify-center w-full items-center h-64">
          <p className="text-sm text-foreground">No Team production data yet</p>
        </div>
      </div>
    </div>
  );
}
