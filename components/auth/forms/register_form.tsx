"use client";

import Link from "next/link";
import { registerSchema, type RegisterRequestData } from "@/validation/auth";
import { CustomButton } from "@/components/custom/common/customButton";
import CustomInput from "@/components/custom/common/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/stores/auth/auth_store";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const { registerStep, setRegisterStep } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequestData>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit: SubmitHandler<RegisterRequestData> = (data) =>
    console.log(data);
  console.log("Current Steps:", registerStep);

  const handleSignup = () => {
    if (registerStep === 1) {
      setRegisterStep(registerStep + 1);
    } else {
      console.log("hello world");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-12 w-lg"
    >
      <div className="flex flex-col gap-3 w-full">
        {registerStep === 1 && (
          <div className="flex flex-col gap-4 relative">
            <CustomInput
              label="Full name"
              placeholder="Enter your full name"
              error={errors.fullname?.message}
              type="text"
              {...(register("fullname"), { required: true })}
            />
            {/*{errors.email && (
              <span className="text-xs text-foundation-error-6 absolute top-1 right-4">
                {errors.email.message}
              </span>
            )}*/}
            <div className="flex flex-col gap-2 relative">
              <CustomInput
                label="Email"
                type="email"
                placeholder="Enter your email address"
                error={errors.email?.message}
                {...register("email", { required: true })}
              />
              {/*{errors.password && (
                <span className="text-xs text-foundation-error-6 absolute left-4 top-1">
                  {errors.password.message}
                </span>
              )}*/}
            </div>
          </div>
        )}

        {registerStep === 2 && (
          <div className="flex flex-col gap-4 relative">
            <CustomInput
              label="Company name"
              placeholder="Enter your company name"
              error={errors.companyName?.message}
              type="text"
              {...register("companyName")}
            />
            {/*{errors.email && (
              <span className="text-xs text-foundation-error-6 absolute top-1 right-4">
                {errors.email.message}
              </span>
            )}*/}
            <div className="flex flex-col gap-2 relative">
              <CustomInput
                label="Password"
                type="password"
                error={errors.password?.message}
                {...register("password", { required: true })}
              />
              {/*{errors.password && (
                <span className="text-xs text-foundation-error-6 absolute left-4 top-1">
                  {errors.password.message}
                </span>
              )}*/}
            </div>
          </div>
        )}

        {/*<Link
          href="/forgot-password"
          className="text-[#E2725B] text-sm/[20px] self-end font-normal"
        >
          Forgot password?
        </Link>*/}
      </div>
      <CustomButton
        type="submit"
        className="w-full py-3"
        onClick={handleSignup}
      >
        {registerStep === 1 ? "Continue" : "Sign up"}
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
