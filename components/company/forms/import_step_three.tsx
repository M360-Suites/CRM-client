import { CustomButton } from "@/components/custom/common/customButton";
import { useCompanyStore } from "@/stores/company/company_store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ImportStepThree() {
  const { setImportSteps, companyPreview, completedSteps, setCompletedSteps } =
    useCompanyStore();
  console.log("completed steps:", completedSteps);
  return (
    <div className="pt-10 flex flex-col gap-12 px-5 relative">
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Company name</TableHead>
              <TableHead className="text-left">Industry</TableHead>
              <TableHead className="text-left">Website</TableHead>
              <TableHead className="text-left">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyPreview.map((contact, index) => (
              <TableRow key={index}>
                <TableCell className="text-left">{contact.name}</TableCell>
                <TableCell className="text-left">{contact.industry}</TableCell>
                <TableCell className="text-left">{contact.website}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <CustomButton
          variant={"ghost"}
          onClick={() => {
            setImportSteps(2);
            setCompletedSteps([3, 4]);
          }}
          className="py-4 px-5 flex-1 text-base"
        >
          Back
        </CustomButton>
        <CustomButton
          className="py-4 px-5 flex-1"
          onClick={() => {
            setImportSteps(4);
            setCompletedSteps([5]);
          }}
        >
          Import
        </CustomButton>
      </div>
    </div>
  );
}
