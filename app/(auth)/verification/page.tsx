import EmailVerificationForm from "@/components/auth/forms/email_verification_form";

const Page = () => {
  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-20 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] tracking-tight font-medium">
          Email verification
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          A 5 digit code has been sent to you email
        </p>
      </div>
      <EmailVerificationForm />
    </div>
  );
};

export default Page;
