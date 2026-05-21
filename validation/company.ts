import { email, z } from "zod";

export const addCompanySchema = z.object({
  companyName: z.string("Invalid company name"),
  companyAddress: z.string("Invalid company address"),
  industry: z.string("Invalid industry"),
  website: z.string("Invalid website").url("Invalid URL format"),
  contactPerson: z.string("Invalid contact person"),
  email: z.email("Invalid email address"),
  phone: z
    .string("Invalid phone number")
    .min(10, "Phone number must be at least 10 digits"),
});

export type AddCompanyRequestData = z.infer<typeof addCompanySchema>;
