import Header from "@/components/ai_writer/header";
import Body from "@/components/ai_writer/body";
export default function page() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <Header />
      <Body />
    </div>
  );
}
