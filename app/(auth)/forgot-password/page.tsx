import ForgotPasswordForm from "@/components/auth/forms/forgot_password_form";

const Page = () => {
  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-8 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] tracking-tight font-medium">
          Forgot Password?
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          No worries, we can help
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default Page;
