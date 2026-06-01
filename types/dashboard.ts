export interface Dashboard {
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

export interface DashboardResponse {
  cards: {
    open_deals: number;
    revenue_forecast: number;
    active_contacts: number;
    active_companies: number;
  };
  card_progress: {
    open_deals: {
      current: number;
      previous: number;
      change: number;
      percent_change: number;
    };
    revenue_forecast: {
      current: number;
      previous: number;
      change: number;
      percent_change: number;
    };
    active_contacts: {
      current: number;
      previous: number;
      change: number;
      percent_change: number;
    };
    active_companies: {
      current: number;
      previous: number;
      change: number;
      percent_change: number;
    };
  };
  charts: {
    from: string;
    to: string;
    contacts: [
      {
        date: string;
        value: number;
      },
    ];
    companies: [
      {
        date: string;
        value: number;
      },
    ];
    deals: [
      {
        date: string;
        open_deals: number;
        revenue_forecast: number;
        total_deals: number;
        total_value: number;
      },
    ];
    tasks: [
      {
        date: string;
        value: number;
      },
    ];
  };
  pipeline_review: [
    {
      stage_id: string;
      name: string;
      order: number;
      count: number;
      value: number;
      is_won: boolean;
      is_lost: boolean;
    },
  ];
  pipeline_total: {
    count: number;
    value: number;
  };
  recent_contacts: [
    {
      id: string;
      first_name: string;
      last_name: string;
      full_name: string;
      role_title: string;
      temperature: "hot" | "warm" | "cold";
      company: string;
      created_at: string;
    },
  ];
  deal_sources: [
    {
      source: string;
      count: number;
      value: number;
    },
  ];
  totals: {};
  period: {};
  pipeline: {};
  tasks: {};
  recent_activities: [{}];
}
