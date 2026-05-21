import { z } from "zod";

export const addDealSchema = z.object({
  title: z.string("Invalid deal title"),
  value: z.number().min(0, "Invalid deal value"),
  source: z.string("Invalid source"),
  industry: z.string("Invalid industry"),
  stage: z.enum(
    ["Lead", "Qualified", "Proposal", "Negotiation", "Closed", "Lost"],
    {
      message: "Invalid stage",
    },
  ),
});

export type AddDealRequestData = z.infer<typeof addDealSchema>;
