import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";

interface AuthorisationPageProps {
  label: string;
  trigger: React.ReactNode;
  // children can be static nodes or a render function that receives `close()`
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}

export default function AuthorisationPage({
  label,
  trigger,
  children,
}: AuthorisationPageProps) {
  return (
    <div className="min-h-120 flex flex-col gap-4 items-center justify-center">
      <p className="text-sm">
        Connect channel so your inbound messages will appear here automatically
        and can be converted to leads.
      </p>
      <CustomDrawer label={label} trigger={trigger}>
        {children}
      </CustomDrawer>
    </div>
  );
}
