import { z } from "zod";

export const addStaffSchema = z.object({
  fullname: z.string().min(1, "fullname is required"),
  email: z.email("invalid email"),
  role: z.string().optional(),
});

export type AddStaffData = z.infer<typeof addStaffSchema>;
