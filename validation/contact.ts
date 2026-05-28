import { z } from "zod";

export const addContactSchema = z.object({
  firstName: z
    .string()
    .min(2, "Firstname is required")
    .max(50, "Firstname cannot exceed 50 characters"),
  lastName: z
    .string("Invalid last name")
    .min(2, "Lastname is required")
    .max(50, "Lastname cannot exceed 50 characters"),
  email: z.email("Invalid email address"),
  phone: z
    .string("Invalid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  role: z
    .string()
    .min(3, "Role is required")
    .max(100, "Role cannot exceed 100 characters"),
  temperature: z.enum(["hot", "warm", "cold"], "Invalid temperature"),
  company: z.string().optional(),
});

export type AddContactRequestData = z.infer<typeof addContactSchema>;
