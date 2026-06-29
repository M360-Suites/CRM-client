import { Metadata } from "next";
import Header from "@/components/ai_writer/header";
import Body from "@/components/ai_writer/body";

export const metadata: Metadata = {
  title: "AI Writer | CRM360",
};
export default function page() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <Header />
      <Body />
    </div>
  );
}
