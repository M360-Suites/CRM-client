export type Notify = {
  _id: string;
  userId: string;
  provider: string;
  type: string;
  title: string;
  metadata: {
    stage_id: string;
    stage_name: string;
    message_id: string;
    sender_name: string;
    preview: string;
  };
  read: boolean;
  created_at: string;
  __v: number;
};

export type NotificationResponse = {
  data: Notify[];
  unread_count: number;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};
