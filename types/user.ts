export interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
}

export interface EmailRequest {
  contact_id?: string;
  deal_id?: string;
  tone: string;
  length: string;
  recipient_name?: string;
  sender_name?: string;
  key_points?: string[];
  additional_notes?: string;
  subject?: string;
}
