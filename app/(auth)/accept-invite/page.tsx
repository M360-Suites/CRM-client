import { Metadata } from "next";
import AcceptInviteClient from "./accept-invite-client";

export const metadata: Metadata = {
  title: "Accept Invitation | CRM360",
};

export default function Page() {
  return <AcceptInviteClient />;
}
