export type AnalyticsSummary = {
  won_revenue: number;
  pipeline_value: number;
  win_rate: number;
  average_cycle_days: number;
  lead_conversion_rate: number;
  tasks_completed_last_30_days: number;
};

export type PipelineStageData = {
  stage_id: string;
  name: string;
  count: number;
  value: number;
}[];

export type LeadSourceData = {
  value: number;
  name: string;
}[];

export type TeamProductivityData = {};
