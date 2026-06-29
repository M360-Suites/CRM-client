import { Metadata } from "next";
import OtpVerificationContent from "./otp-client";

export const metadata: Metadata = {
  title: "OTP Verification | CRM360",
};

export default function Page() {
  return <OtpVerificationContent />;
}
