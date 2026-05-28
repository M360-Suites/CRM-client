export interface Company {
  _id: string;
  name: string;
  industry: string;
  website: string;
  owner_id: {
    _id: string;
    email: string;
    display_name: string;
  };
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  stats: {
    contact_count: number;
    deal_count: number;
    pipeline_value: number;
    won_revenue: number;
  };
}
