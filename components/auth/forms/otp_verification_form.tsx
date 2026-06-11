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
import { useOTPVerification } from "@/hooks/auth/otp-verification";
import { useResendVerification } from "@/hooks/auth/resend_verification";

interface EmailVerificationFormProps {
  email: string;
}

export default function OtpVerificationForm({
  email,
}: EmailVerificationFormProps) {
  const { mutate: resendVerification, isPending: isResending } =
    useResendVerification();
  const { mutate: verifyOTP, isPending } = useOTPVerification();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailVerficationRequestData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { otp: "" },
  });
  const onSubmit: SubmitHandler<EmailVerficationRequestData> = (data) => {
    console.log(data);
    const payload = { email, otp: data.otp };
    verifyOTP(payload);
  };

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
  };

  const handleResend = () => {
    resendVerification({ email });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-10 max-lg:gap-10 w-full"
    >
      <div className="flex flex-col gap-3 ">
        <div className="flex flex-col gap-6 max-md:gap-3 w-full">
          <div className="w-full relative flex flex-col gap-2 justify-center items-center">
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
            {errors.otp && (
              <span className="text-xs text-foundation-error-6 absolute -bottom-6 left-5 xl:left-20">
                {errors.otp.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 max-lg:gap-2 w-full">
        <div className="flex flex-row items-start gap-2 justify-start w-full">
          <span className="text-foundation-gray-4 font-normal text-sm/[20px] max-lg:text-sm">
            Didn&apos;t recieve the code?
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-[#E2725B] max-lg:text-sm text-sm/[20px] hover:underline font-medium cursor-pointer"
          >
            Resend
          </button>
        </div>
        <CustomButton
          type="submit"
          disabled={isPending || isResending}
          className="w-full py-3.5"
        >
          {isPending ? "Verifying..." : "Continue"}
        </CustomButton>
      </div>
    </form>
  );
}
