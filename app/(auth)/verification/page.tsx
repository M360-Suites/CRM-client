import { Metadata } from "next";
import VerificationClient from "./verification-client";

export const metadata: Metadata = {
  title: "Verify Email | CRM360",
};

export default function Page() {
  return <VerificationClient />;
}
