import { z } from "zod";

export const addDocumentSchema = z.object({
  folderName: z.string().min(1, "Folder name is required"),
  folderDescription: z.string().optional(),
});

export type AddDocumentRequestData = z.infer<typeof addDocumentSchema>;
