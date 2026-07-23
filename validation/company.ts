import { z } from "zod";

export const addCompanySchema = z.object({
  _id: z.string().optional(),
  companyName: z.string().min(2, "Company name is required"),
  companyAddress: z.string().min(5, "Company address is required"),
  industry: z.string().min(2, "Industry is required"),
  website: z.literal("").or(z.url("Invalid URL format")).optional(),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.literal("").or(z.email("Invalid email address")).optional(),
  phone: z
    .string()
    .min(10, "Phone number is required and must be at least 10 digits"),
});

export type AddCompanyRequestData = z.infer<typeof addCompanySchema>;
