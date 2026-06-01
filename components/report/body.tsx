"use client";

import PipelineByStage from "./analytics_card/pipeline_by_stage";
import PipelineByLead from "./analytics_card/pipeline_by_lead";
import PipelineByLeadTemp from "./analytics_card/pipeline_lead_by_temp";

import { useAnalyticsLeadSource } from "@/hooks/report/report_lead_source";
import { useReportLeadTemp } from "@/hooks/report/report_by_leadtemp";
import { useAnalyticsPipelineStage } from "@/hooks/report/report_pipeline_stage";

export default function Body() {
  const { data: leadSourceData, isLoading: isLeadSourceLoading } =
    useAnalyticsLeadSource();
  const { data: pipelineStageData, isLoading: isPipelineStageLoading } =
    useAnalyticsPipelineStage();
  const { data: pipelineLeadTemp, isPending: isTempLeadLoading } =
    useReportLeadTemp();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-2 gap-6 w-full min-h-80">
        <div className="p-4 border border-[#E8E8E8] rounded-[8px] flex flex-col gap-2">
          <h2 className="text-base font-medium text-foreground">
            Pipeline by stage
          </h2>
          <div className="flex justify-center items-center h-full">
            {isPipelineStageLoading ? (
              <div className="w-full h-64 animate-pulse bg-[#E8E8E8]/50 rounded-[8px]" />
            ) : pipelineStageData?.length === 0 ? (
              <p className="text-sm text-foreground">
                This chart shows the distribution of leads across different
                stages of the pipeline.
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
              <p className="text-sm text-foreground">
                This chart shows the distribution of leads across different
                stages of the pipeline.
              </p>
            ) : (
              <PipelineByLead />
            )}
          </div>
        </div>
      </div>
      <div className="p-4 min-h-80 border w-1/2 border-[#E8E8E8] rounded-[8px] flex flex-col gap-2">
        <h2 className="text-base font-medium text-foreground">
          Lead Temperature
        </h2>
        <div className="flex justify-center h-[300px] items-center">
          {isTempLeadLoading ? (
            <div className="w-full h-64 animate-pulse bg-[#E8E8E8]/50 rounded-[8px]" />
          ) : pipelineLeadTemp?.length === 0 ? (
            <p className="text-sm text-foreground">No Data Yet</p>
          ) : (
            <PipelineByLeadTemp />
          )}
        </div>
      </div>
    </div>
  );
}
