import Header from "@/components/pipeline/header";
import Body from "@/components/pipeline/body";

export default function page() {
  return (
    <div className="w-full h-full flex flex-col gap-12 pb-8">
      <Header />
      <Body />
    </div>
  );
}
