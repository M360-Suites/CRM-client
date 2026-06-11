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
import { useEmailVerification } from "@/hooks/auth/email-verification";
import { useResendVerification } from "@/hooks/auth/resend_verification";

interface EmailVerificationFormProps {
  email: string;
}

export default function EmailVerificationForm({
  email,
}: EmailVerificationFormProps) {
  const { mutate: resendVerification, isPending: isResending } =
    useResendVerification();
  const { mutate: verifyEmail, isPending } = useEmailVerification();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailVerficationRequestData>({
    resolver: zodResolver(emailVerificationSchema),
  });
  const onSubmit: SubmitHandler<EmailVerficationRequestData> = (data) => {
    console.log(data);
    const payload = { email, otp: data.otp };
    verifyEmail(payload);
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
      className="flex flex-col gap-10 w-full"
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full relative">
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
              <span className="text-xs text-foundation-error-6 absolute -bottom-5 left-0">
                {errors.otp.message}
              </span>
            )}
          </div>
          <div className="flex flex-row items-start gap-2 justify-start w-full">
            <span className="text-foundation-gray-4 font-normal text-base/[20px]">
              Didn&apos;t recieve the code?
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#E2725B] text-base/[20px] hover:underline font-medium cursor-pointer"
            >
              Resend
            </button>
          </div>
        </div>
      </div>
      <CustomButton
        type="submit"
        disabled={isPending || isResending}
        className="w-full py-3"
      >
        {isPending ? "Verifying..." : "Continue"}
      </CustomButton>
    </form>
  );
}
