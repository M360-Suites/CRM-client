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
          <TableHeader className="bg-[#FFF6EC]">
            <TableRow>
              <TableHead className="text-left px-2">Firstname</TableHead>
              <TableHead className="text-left px-2">Lastname</TableHead>
              <TableHead className="text-left px-2">Email</TableHead>
              <TableHead className="text-left px-2">Phone</TableHead>
              <TableHead className="text-left px-2">Role/Title</TableHead>
              <TableHead className="text-left px-2">Temperature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactPreview.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell className="font-normals text-left">
                  {contact.first_name}
                </TableCell>
                <TableCell className="text-left text-foreground">
                  {contact.last_name}
                </TableCell>
                <TableCell className="text-left text-foreground">
                  {contact.email}
                </TableCell>
                <TableCell className="text-left text-foreground">
                  {contact.phone}
                </TableCell>
                <TableCell className="text-left text-foreground">
                  {contact.role_title}
                </TableCell>
                <TableCell className="text-left text-foreground">
                  {contact.temperature}
                </TableCell>
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
