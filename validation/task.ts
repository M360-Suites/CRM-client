import { z } from "zod";

export const addTaskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["task", "calendar"], { message: "Invalid type" }),
  priority: z.enum(["low", "medium", "high"], { message: "Invalid priority" }),
  status: z.enum(["pending", "in_progress", "completed"], {
    message: "Invalid status",
  }),
  description: z.string().optional(),
  due_at: z.string().optional(),
  duration_minutes: z.string().optional(),
  location: z.string().optional(),
  meeting_url: z.url("Invalid URL format").optional(),
  contact_id: z.string().optional(),
  deal_id: z.string().optional(),
  company_id: z.string().optional(),
  assignees: z.array(z.string()).optional(),
});

export type AddTaskRequestData = z.infer<typeof addTaskSchema>;
