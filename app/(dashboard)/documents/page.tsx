import Header from "@/components/document/header";
import Body from "@/components/document/body";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-12 pb-8">
      <Header />
      <Body />
    </div>
  );
}
