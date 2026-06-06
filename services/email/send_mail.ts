import { apiClient } from "@/services/apiclient";
import { SendMailRequest } from "@/types/gmail";

/**
 * SendGmail
 * - builds a FormData payload to match the multipart/form-data curl example
 * - supports attachments as File | File[] | Blob | string
 */
export const SendGmail = async (payload: SendMailRequest) => {
  const form = new FormData();

  if ("contact_id" in payload && payload.contact_id != null) {
    form.append("contact_id", String(payload.contact_id));
  }
  if ("deal_id" in payload && payload.deal_id != null) {
    form.append("deal_id", String(payload.deal_id));
  }
  if ("to" in payload && payload.to != null) {
    form.append("to", String(payload.to));
  }
  if ("subject" in payload && payload.subject != null) {
    form.append("subject", String(payload.subject));
  }
  if ("body" in payload && payload.body != null) {
    form.append("body", String(payload.body));
  }

  // attachments: accept File | File[] | Blob | string
  const attachments = (payload as any).attachments;
  if (attachments != null) {
    if (Array.isArray(attachments)) {
      attachments.forEach((a, idx) => {
        if (a instanceof File || a instanceof Blob) {
          form.append(
            "attachments",
            a,
            (a as File).name ?? `attachment-${idx}`,
          );
        } else {
          form.append("attachments", String(a));
        }
      });
    } else if (attachments instanceof File || attachments instanceof Blob) {
      form.append(
        "attachments",
        attachments,
        (attachments as File).name ?? "attachment",
      );
    } else {
      form.append("attachments", String(attachments));
    }
  }

  // Do NOT set Content-Type header here — let the browser set the multipart boundary.
  const response = await apiClient.post("/ai/email/send", form, true);
  return response;
};
