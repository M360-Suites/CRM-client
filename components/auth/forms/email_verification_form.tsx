"use client";

import Link from "next/link";
import {
  emailVerificationSchema,
  type EmailVerficationRequestData,
} from "@/validation/auth";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CustomButton } from "@/components/custom/common/customButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomOtpInput } from "@/components/custom/common/customOtpInput";

export default function EmailVerificationForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailVerficationRequestData>({
    resolver: zodResolver(emailVerificationSchema),
  });
  const onSubmit: SubmitHandler<EmailVerficationRequestData> = (data) =>
    console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 w-lg max-w-full"
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-6 w-full">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <CustomOtpInput
                value={field.value}
                onChange={field.onChange}
                error={errors.otp?.message}
              />
            )}
          />
          <div className="flex flex-row items-start gap-2 justify-start w-full">
            <span className="text-foundation-gray-4 font-normal text-base/[20px]">
              Didn&apos;t recieve the code?
            </span>
            <Link
              href="#"
              className="text-[#E2725B] text-base/[20px] font-medium"
            >
              Resend
            </Link>
          </div>
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
