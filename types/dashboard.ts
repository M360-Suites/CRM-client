export interface DashboardResponse {
  cards: {
    open_deals: number;
    revenue_forecast: number;
    active_contacts: number;
    active_companies: number;
  };
  pipeline_review: {
    stage_id: string;
    name: "Leads" | "Qualified" | "Proposals" | "Negotiations" | "Won" | "Lost";
    order: string;
    count: number;
    value: number;
    is_won: boolean;
    is_lost: boolean;
  }[];
  recent_contacts: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    initials: string;
    role_title: string;
    temperature: "hot" | "warm" | "cold";
    company: string;
    created_at: string;
  }[];
  deal_sources: [];
  totals: {
    contacts: number;
    companies: number;
    deals: number;
    tasks: number;
  };
  period: {
    contacts: number;
    companies: number;
    deals: number;
    tasks: number;
  };
  pipeline: {
    open_deals: number;
    open_value: number;
    won_deals: number;
    won_value: number;
    lost_deals: number;
    lost_value: number;
    win_rate: number;
  };
  tasks: {
    by_status: [];
    overdue: number;
    due_next_7_days: number;
  };
  recent_activities: [];
}
