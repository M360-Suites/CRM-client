import { Metadata } from "next";
import Header from "@/components/tasks_and_calendar/header";
import MainBody from "@/components/tasks_and_calendar/body";

export const metadata: Metadata = {
  title: "Tasks | CRM360",
};
export default function page() {
  return (
    <div className="w-full flex flex-col gap-12 pb-8">
      <Header />
      <MainBody />
    </div>
  );
}
