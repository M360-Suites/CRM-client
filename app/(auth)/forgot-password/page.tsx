import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/forms/forgot_password_form";

export const metadata: Metadata = {
  title: "Forgot Password | CRM360",
};

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full gap-8 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] max-md:text-2xl/[120%] max-xs:text-lg tracking-tight font-medium">
          Forgot Password
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          Enter your email address to continue
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default Page;
