"use client";

import {
  forgotPasswordSchema,
  type ForgotRequestData,
} from "@/validation/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { CustomButton } from "@/components/custom/common/customButton";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/custom/common/customInput";
import { useForgotPassword } from "@/hooks/auth/forgot-password";

export default function ForgotPasswordForm() {
  const { mutate: forgotPassword, isPending: isLoading } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotRequestData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const onSubmit: SubmitHandler<ForgotRequestData> = (data) => {
    console.log(data);
    forgotPassword(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-12 w-full"
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full relative">
          <CustomInput
            label="Email address"
            placeholder="you@example.com"
            error={errors.email?.message}
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-xs text-foundation-error-6 absolute -bottom-5 left-0">
              {errors.email.message}
            </span>
          )}
        </div>
      </div>
      <CustomButton
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </CustomButton>
    </form>
  );
}
