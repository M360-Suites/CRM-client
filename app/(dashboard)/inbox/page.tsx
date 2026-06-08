import { Suspense } from "react";
import Header from "@/components/inbox/header";
import Body from "@/components/inbox/body";

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
