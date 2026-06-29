import { Metadata } from "next";
import Header from "@/components/analytics/header";
import Body from "@/components/analytics/body";

export const metadata: Metadata = {
  title: "Analytics | CRM360",
};
export default function page() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <Header />
      <Body />
    </div>
  );
}
