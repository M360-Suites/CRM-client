import Header from "@/components/company/header";
import Body from "@/components/company/body";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-12 pb-8">
      <Header />
      <Body />
    </div>
  );
}
