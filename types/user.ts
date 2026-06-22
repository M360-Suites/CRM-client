export interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
}

export interface EmailRequest {
  contact_id?: string;
  deal_id?: string;
  tone: string;
  length: string;
  recipient_name?: string;
  sender_name?: string;
  key_points?: string[];
  additional_notes?: string;
  subject?: string;
}
export interface EmailResponse {
  subject: string;
  body: string;
}

export type UserRole = "admin" | "sales_rep" | "sales_manager" | "viewer";

export  interface UserInvitationResponse {
      _id: string,
      email: string,
      display_name: string,
      role: UserRole,
      organization_id: string,
      invited_by: {
        _id: string,
        email: string,
        display_name: string
      },
      token_hash: string,
      expires_at: string,
      accepted_at: null,
      revoked_at: null,
      created_at: string,
      updated_at: string,
      __v: number
}