import Header from "@/components/tasks_and_calendar/header";
import MainBody from "@/components/tasks_and_calendar/body";
export default function page() {
  return (
    <div className="w-full flex flex-col gap-12 pb-8">
      <Header />
      <MainBody />
    </div>
  );
}
