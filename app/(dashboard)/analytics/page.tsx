import Header from "@/components/analytics/header";
import Body from "@/components/analytics/body";
export default function page() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <Header />
      <Body />
    </div>
  );
}
