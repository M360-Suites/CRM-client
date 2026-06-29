import { Metadata } from "next";
import Header from "@/components/report/header";
import Body from "@/components/report/body";

export const metadata: Metadata = {
  title: "Report | CRM360",
};
export default function page() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <Header />
      <Body />
    </div>
  );
}
