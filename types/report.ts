export type ReportSummary = {
  period: {
    from: string;
    to: string;
  };
  previous_period: {
    from: string;
    to: string;
  };
  total_deals: {
    current: number;
    previous: number;
    percentage_change: number;
    direction: string;
  };
  open_value: {
    current: number;
    previous: number;
    percentage_change: number;
    direction: string;
  };
  won_value: {
    current: number;
    previous: number;
    percentage_change: number;
    direction: string;
  };
  lost_value: {
    current: number;
    previous: number;
    percentage_change: number;
    direction: string;
  };
};

export type PipelineStageData = {
  name: string;
  count: number;
  value: number;
}[];

export type LeadSourceData = {
  value: number;
  name: string;
}[];

export type ContactTemperatureData = {
  value: number;
  name: string;
}[];
