import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/settings/header";
import Body from "@/components/settings/body";

export const metadata: Metadata = {
  title: "Settings | CRM360",
};
export default function page() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <Header />
      <Suspense fallback={null}>
        <Body />
      </Suspense>
    </div>
  );
}
