export interface GmailAuthResponse {
  url: string;
}

export interface GmailStatusResponse {
  connected: boolean;
  gmail_sync_enabled: boolean;
  last_sync_at: string;
  synced_count: number;
  channel: string;
}

export interface SyncResponse {
  synced: string;
  total: number;
  linked: number;
}

export interface MailResponse {
  _id: string;
  user_id: string;
  organization_id: string;
  gmail_message_id: string;
  thread_id: string;
  from_name: string;
  from_email: string;
  to: string[];
  subject: string;
  snippet: string;
  received_at: string;
  is_read: boolean;
  contact_id: string | null;
  created_at: string;
  __v: number;
}

export interface GmailDataResponse {
  status: boolean;
  data: MailResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  stats: {
    synced_count: number;
    link_ratio: number;
    linked_senders: number;
    total_senders: number;
    linked_messages: number;
  };
}
export interface SendMailRequest {
  contact_id?: string;
  deal_id?: string;
  to: string;
  subject: string;
  body: string;
}

export interface SendMailResponse {
  subject: string;
  recipients: {
    address: string;
    name: string;
  }[];
  from: {
    address: string;
    name: string;
  };
  gmail_message_id: string;
  thread_id: string;
  sent_at: string;
}
