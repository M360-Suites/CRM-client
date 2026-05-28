import { z } from "zod";

export const addDealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  value: z.coerce
    .number()
    .min(1, "Deal value is required") // 👈 min(1) rejects 0 and empty
    .positive("Deal value must be greater than 0"),
  source: z.string().min(1, "Source is required"),
  industry: z.string().min(1, "Industry is required"),
  stage: z.enum(
    [
      "leads",
      "qualified",
      "proposals",
      "negotiations",
      "won",
      "lost",
      "closed",
    ],
    { message: "Invalid stage" },
  ),
});

export type AddDealRequestData = z.input<typeof addDealSchema>;
export type AddDealOutputData = z.output<typeof addDealSchema>;
