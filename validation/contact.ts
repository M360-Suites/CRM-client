import { z } from "zod";

export const addContactSchema = z.object({
  firstName: z.string().min(2, "Firstname cannot be empty"),
  lastName: z.string("Invalid last name").min(2, "Lastname cannot be empty"),
  email: z.email("Invalid email address"),
  phone: z
    .string("Invalid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  role: z.string("Invalid role").min(3, "Role cannot be empty"),
  temperature: z.enum(["hot", "warm", "cold"], "Invalid temperature"),
  company: z.string("Invalid company name").optional(),
});

export type AddContactRequestData = z.infer<typeof addContactSchema>;
