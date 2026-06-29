import LoginForm from "@/components/auth/forms/login_form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | CRM360",
};
const LoginPage = () => {
  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-8 max-lg:gap-5 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] lg:text-3xl/[120%] max-md:text-2xl/[120%] max-xs:text-lg tracking-tight font-medium">
          Welcome back
        </h2>
        <p className="text-foreground text-base/[120%] max-sm:text-sm/[120%] font-normal text-center">
          Enter your credentials to access your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
