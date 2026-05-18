import Header from "@/components/contacts/header";
import Body from "@/components/contacts/body";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-12 pb-8">
      <Header />
      <Body />
    </div>
  );
}
