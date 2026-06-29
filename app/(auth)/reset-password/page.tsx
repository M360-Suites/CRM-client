import { Metadata } from "next";
import ResetPasswordClient from "./reset-password-client";

export const metadata: Metadata = {
  title: "Reset Password | CRM360",
};

export default function Page() {
  return <ResetPasswordClient />;
}
