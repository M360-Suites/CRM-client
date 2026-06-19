import Header from "@/components/settings/header";
import Body from "@/components/settings/body";
export default function page() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <Header />
      <Body />
    </div>
  );
}
