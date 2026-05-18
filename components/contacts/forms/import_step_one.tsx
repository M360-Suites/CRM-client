import { UploadIcon, Download } from "lucide-react";
import { useContactStore } from "@/stores/contact/contact_store";
import { CustomButton } from "@/components/custom/common/customButton";

export default function ImportStepOne() {
  const { setImportSteps, setCompletedSteps } = useContactStore();
  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        className="border border-dashed h-60 rounded-[12px] flex flex-col items-center justify-center gap-2"
        onClick={() => {
          setCompletedSteps([1]);
          setImportSteps(2);
        }}
      >
        <UploadIcon size={36} color="#4A4A4A" />
        <span className="text-foreground text-sm font-normal">
          Upload your file
        </span>
        <span className="text-sm text-foreground">
          CSV, XLSX, or XLS (first row = headers)
        </span>
      </div>
      <CustomButton
        variant="ghost"
        className="w-full flex flex-row items-center gap-2 rounded-[20px] py-3"
      >
        <Download size={16} />
        <span className="text-sm">Download sample CSV template</span>
      </CustomButton>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-foreground">Expected columns:</span>
        <ul className=" text-sm text-foreground">
          <li className="flex flex-row items-center gap-2 p-2.5">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#C95C47" />
            </svg>
            First Name
          </li>
          <li className="flex flex-row items-center gap-2 p-2.5">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#C95C47" />
            </svg>
            Last Name
          </li>
          <li className="flex flex-row items-center gap-2 p-2.5">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#C95C47" />
            </svg>
            Email
          </li>
          <li className="flex flex-row items-center gap-2 p-2.5">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#C95C47" />
            </svg>
            Phone
          </li>
          <li className="flex flex-row items-center gap-2 p-2.5">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#C95C47" />
            </svg>
            Role
          </li>
          <li className="flex flex-row items-center gap-2 p-2.5">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="4" cy="4" r="4" fill="#C95C47" />
            </svg>
            Temperature(hot/warm/cold)
          </li>
        </ul>
      </div>
    </div>
  );
}
