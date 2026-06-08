export interface Task {
  _id: string;
  title: string;
  type: "task" | "calendar";
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  due_at: string;
  description?: string;
  duration_minutes?: number;
  location?: string;
  meeting_url?: string;
  deal_id?: {
    _id: string;
    title: string;
  };
  owner_id: {
    _id: string;
    email: string;
    display_name: string;
  };
  organization_id: string;
  assignees: Array<{
    _id: string;
    email: string;
    display_name: string;
  }>;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface TaskResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
