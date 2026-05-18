import DashCard from "@/components/dashboard/custom/dashcard";
import DashTable from "@/components/dashboard/custom/dash_table";

const Page = () => {
  return (
    <div className="w-full flex flex-col gap-6 pb-8">
      <DashCard />
      <DashTable />
    </div>
  );
};

export default Page;
