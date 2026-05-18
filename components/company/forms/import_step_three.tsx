import { CustomSelect } from "@/components/custom/common/customSelect";
import { CustomButton } from "@/components/custom/common/customButton";
import { useContactStore } from "@/stores/contact/contact_store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ImportStepThree() {
  const { setImportSteps, contactPreview, completedSteps, setCompletedSteps } =
    useContactStore();
  console.log("completed steps:", completedSteps);
  return (
    <div className="pt-10 flex flex-col gap-12 px-5 relative">
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Firstname</TableHead>
              <TableHead className="text-right">Lastname</TableHead>
              <TableHead className="text-right">Email</TableHead>
              <TableHead className="text-right">Phone</TableHead>
              <TableHead className="text-right">Role/Title</TableHead>
              <TableHead className="text-right">Temperature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactPreview.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium text-right">
                  {contact.firstname}
                </TableCell>
                <TableCell className="text-right">{contact.lastname}</TableCell>
                <TableCell className="text-right">{contact.email}</TableCell>
                <TableCell className="text-right">{contact.phone}</TableCell>
                <TableCell className="text-right">{contact.role}</TableCell>
                <TableCell className="text-right">{contact.status}</TableCell>
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
        <CustomButton className="py-4 px-5 flex-1">Import</CustomButton>
      </div>
    </div>
  );
}
