import { z } from "zod";

export const addDealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  value: z.coerce
    .number()
    .min(1, "Deal value is required") // 👈 min(1) rejects 0 and empty
    .positive("Deal value must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  source: z.string().min(1, "Source is required"),
  industry: z.string().optional(),
  company_id: z.string().nullable().optional(),
  stage_id: z.string().min(1, "Stage is required"),
});

export type AddDealRequestData = z.input<typeof addDealSchema>;
export type AddDealOutputData = z.output<typeof addDealSchema>;
