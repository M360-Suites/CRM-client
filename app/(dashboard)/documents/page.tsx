import { Metadata } from "next";
import Header from "@/components/document/header";
import Body from "@/components/document/body";

export const metadata: Metadata = {
  title: "Documents | CRM360",
};

export default function page() {
  return (
    <div className="w-full flex flex-col gap-12 pb-8">
      <Header />
      <Body />
    </div>
  );
}
