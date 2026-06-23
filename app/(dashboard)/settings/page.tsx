import Header from "@/components/settings/header";
import Body from "@/components/settings/body";
import { Suspense } from "react";
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
