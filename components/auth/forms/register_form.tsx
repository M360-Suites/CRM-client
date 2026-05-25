"use client";

import Link from "next/link";
import { registerSchema, type RegisterRequestData } from "@/validation/auth";
import { CustomButton } from "@/components/custom/common/customButton";
import CustomInput from "@/components/custom/common/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/stores/auth/auth_store";
import { useRegister } from "@/hooks/auth/register";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const { registerStep, setRegisterStep } = useAuthStore();
  const { mutate: registerUser, isPending: isLoading } = useRegister();
  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterRequestData>({
    resolver: zodResolver(registerSchema),
  });

  const handleContinue = async () => {
    const isValid = await trigger(["fullname", "email"]);
    if (isValid) {
      clearErrors();
      setRegisterStep(registerStep + 1);
    }
  };
  const onSubmit: SubmitHandler<RegisterRequestData> = async (data) => {
    console.log(data);
    console.log("Current Steps:", registerStep);
    registerUser(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-12 w-lg"
    >
      {registerStep === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 relative">
            <CustomInput
              label="Full name"
              placeholder="Enter your full name"
              error={errors.fullname?.message}
              type="text"
              {...register("fullname", { required: true })}
            />
            {errors.fullname && (
              <span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
                {errors.fullname.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <CustomInput
              label="Email"
              type="email"
              placeholder="Enter your email address"
              error={errors.email?.message}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-xs text-foundation-error-6 absolute left-0 -bottom-5">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>
      )}

      {registerStep === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 relative">
            <CustomInput
              label="Company name"
              placeholder="Enter your company name"
              error={errors.companyName?.message}
              type="text"
              {...register("companyName", { required: true })}
            />
            {errors.companyName && (
              <span className="text-xs text-foundation-error-6 absolute left-0 -bottom-5">
                {errors.companyName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <CustomInput
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-xs text-foundation-error-6 absolute left-0 -bottom-5">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
      )}

      {/*<Link
          href="/forgot-password"
          className="text-[#E2725B] text-sm/[20px] self-end font-normal"
        >
          Forgot password?
        </Link>*/}
      <CustomButton
        type={registerStep === 1 ? "button" : "submit"}
        onClick={registerStep === 1 ? handleContinue : undefined}
        disabled={isLoading}
        className="w-full py-3"
      >
        {registerStep === 1
          ? "Continue"
          : isLoading
            ? "Submitting..."
            : "Sign up"}
      </CustomButton>
      <div className="flex flex-row items-center gap-2 justify-center">
        <span className="text-foundation-gray-4 font-normal text-base/[20px]">
          Already have an account?
        </span>
        <Link
          href="/login"
          className="text-[#E2725B] text-sm/[20px] font-medium"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
