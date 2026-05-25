import { z } from "zod";

export const addCompanySchema = z.object({
  _id: z.string().optional(),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyAddress: z
    .string()
    .min(5, "Company address must be at least 5 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  website: z.url("Invalid URL format"),
  contactPerson: z
    .string()
    .min(2, "Contact person must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z
    .string("Invalid phone number")
    .min(10, "Phone number must be at least 10 digits"),
});

export type AddCompanyRequestData = z.infer<typeof addCompanySchema>;
