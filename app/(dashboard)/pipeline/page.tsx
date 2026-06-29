import { Metadata } from "next";
import Header from "@/components/pipeline/header";
import Body from "@/components/pipeline/body";

export const metadata: Metadata = {
  title: "Pipeline | CRM360",
};

export default function page() {
  return (
    <div className="w-full h-full flex flex-col gap-12 pb-8">
      <Header />
      <Body />
    </div>
  );
}
