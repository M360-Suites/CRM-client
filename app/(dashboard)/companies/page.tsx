import { Metadata } from "next";
import Header from "@/components/company/header";
import Body from "@/components/company/body";

export const metadata: Metadata = {
  title: "Companies | CRM360",
};

export default function page() {
  return (
    <div className="w-full flex flex-col gap-12 pb-8">
      <Header />
      <Body />
    </div>
  );
}
