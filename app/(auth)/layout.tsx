import Image from "next/image";
import CRMLOGO from "@/public/assets/company/logo.png";
import HalfSide from "@/components/auth/halfside";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex flex-row gap-4 justify-between font-inter bg-white w-full h-full py-5 px-6">
        <div className="sticky top-0 h-full w-1/2">
          <HalfSide />
        </div>
        <div className="w-1/2 overflow-y-auto flex flex-col gap-16 pt-5">
          <div className="self-end">
            <Image
              src={CRMLOGO}
              alt="crm_logo"
              width={800}
              height={800}
              className="h-12 w-auto"
            />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
