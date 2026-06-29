import { Metadata } from "next";
import RegisterPageClient from "./register-client";

export const metadata: Metadata = {
  title: "Register | CRM360",
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
