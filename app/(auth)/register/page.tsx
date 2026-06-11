"use client";

import RegisterForm from "@/components/auth/forms/register_form";
import { useAuthStore } from "@/stores/auth/auth_store";

const RegisterPage = () => {
  const { registerStep } = useAuthStore();

  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-8 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] max-md:text-2xl/[120%] max-xs:text-lg tracking-tight font-medium">
          {registerStep === 1 ? "Create an Account" : "Welcome to CRM360"}
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          {registerStep === 1
            ? "Enter your details to create an account"
            : "Enter your details to proceed further"}
        </p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
