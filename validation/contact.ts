import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input/max";

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
    .min(1, "Phone number is required")
    .refine(
      (value) => isValidPhoneNumber(value),
      "Enter a valid phone number for the selected country",
    ),
  role: z
    .string()
    .min(3, "Role is required")
    .max(100, "Role cannot exceed 100 characters"),
  temperature: z.enum(["hot", "warm", "cold"], "Invalid temperature"),
  company: z.string().optional(),
});

export type AddContactRequestData = z.infer<typeof addContactSchema>;
