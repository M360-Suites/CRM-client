export interface Contact {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_title: string;
  company_id: {
    _id: string;
    name: string;
    industry: string;
    website: string;
  };
  owner_id: {
    _id: string;
    email: string;
    display_name: string;
  };
  temperature: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ContactResponse {
  data: Contact[];
  limit: string;
  page: string;
  total: number;
  total_pages: number;
}
