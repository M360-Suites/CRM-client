import { z } from "zod";

export const addContactSchema = z.object({
  firstName: z.string("Invalid first name"),
  lastName: z.string("Invalid last name"),
  email: z.email("Invalid email address"),
  phone: z
    .string("Invalid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  role: z.string("Invalid role"),
  temperature: z.enum(["Hot", "Warm", "Cold"], "Invalid temperature"),
  company: z.string("Invalid company name"),
});

export type AddContactRequestData = z.infer<typeof addContactSchema>;
