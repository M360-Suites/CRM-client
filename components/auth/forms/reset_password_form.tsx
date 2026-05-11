"use client";

import { resetPasswordSchema, type ResetRequestData } from "@/validation/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { CustomButton } from "@/components/custom/common/customButton";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/custom/common/customInput";

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetRequestData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit: SubmitHandler<ResetRequestData> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 w-lg max-w-full"
    >
      <div className="flex flex-col gap-3 w-full pb-14">
        <div className="flex flex-col gap-4 relative">
          <CustomInput
            label="New Password"
            placeholder=""
            error={errors.newPassword?.message}
            type="password"
            {...register("newPassword")}
          />
          {/*{errors.email && (
            <span className="text-xs text-foundation-error-6 absolute top-1 right-4">
              {errors.email.message}
            </span>
          )}*/}
        </div>
        <div className="flex flex-col gap-4 relative">
          <CustomInput
            label="Confirm Password"
            placeholder=""
            error={errors.confirmPassword?.message}
            type="password"
            {...register("confirmPassword")}
          />
          {/*{errors.email && (
            <span className="text-xs text-foundation-error-6 absolute top-1 right-4">
              {errors.email.message}
            </span>
          )}*/}
        </div>
      </div>
      <CustomButton type="submit" className="w-full py-3">
        Continue
      </CustomButton>
      {/*<div className="flex flex-row items-center gap-2 justify-center">
        <span className="text-foundation-gray-4 font-normal text-base/[20px]">
          Don&apos;t have an account?
        </span>
        <Link
          href="/register"
          className="text-[#E2725B] text-sm/[20px] font-medium"
        >
          Sign up
        </Link>
      </div>*/}
    </form>
  );
}
