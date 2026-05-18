import OnboardingForm from "@/components/auth/forms/onboarding_form";
const RegisterPage = () => {
  return (
    <div className="flex flex-col h-full items-center justify-start w-full gap-8 bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-foreground text-[32px]/[120%] tracking-tight font-medium">
          Let's set up your account
        </h2>
        <p className="text-foreground text-base/[120%] tracking-[-0.002em] font-normal">
          Enter your company information for customized experience
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
};

export default RegisterPage;
