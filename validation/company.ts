import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input/max";

export const WEBSITE_PREFIX = "https://";

/** Drops a bare "https://" and a doubled scheme from pasting a full URL. */
export const normalizeWebsite = (value?: string) => {
  const trimmed = (value ?? "").trim();
  if (trimmed === WEBSITE_PREFIX || trimmed === "http://") return "";
  return trimmed.replace(/^https?:\/\/(?=https?:\/\/)/i, "");
};

export const addCompanySchema = z.object({
  _id: z.string().optional(),
  companyName: z.string().min(2, "Company name is required"),
  companyAddress: z.string().min(5, "Company address is required"),
  industry: z.string().min(2, "Industry is required"),
  // The form pre-fills "https://", so a bare prefix counts as no website
  website: z
    .literal("")
    .or(z.literal(WEBSITE_PREFIX))
    .or(z.url("Invalid URL format"))
    .optional(),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.literal("").or(z.email("Invalid email address")).optional(),
  phone: z
    .string("Invalid phone number")
    .min(1, "Phone number is required")
    .refine(
      (value) => isValidPhoneNumber(value),
      "Enter a valid phone number for the selected country",
    ),
});

export type AddCompanyRequestData = z.infer<typeof addCompanySchema>;
