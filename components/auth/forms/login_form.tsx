"use client";

import Link from "next/link";
import { loginSchema, type LoginRequestData } from "@/validation/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { CustomButton } from "@/components/custom/common/customButton";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/custom/common/customInput";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestData>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<LoginRequestData> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 w-lg">
      <div className="flex flex-col gap-6 w-full">
        <div className='flex flex-col gap-4 relative'>
          <CustomInput label="Email address" placeholder="you@example.com" error={errors.email?.message} type="email" {...register("email")} />
          {/* {errors.email && <span className="text-xs text-foundation-error-6 absolute top-21 right-4">{errors.email.message}</span>} */}
          <div className="flex flex-col gap-2 relative">
            <CustomInput
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register("password", { required: true })}
            />
            {/* {errors.password && <span className="text-xs text-foundation-error-6 absolute left-4 top-21">{errors.password.message}</span>} */}
          </div>
      </div>
        <div className="flex flex-row items-center justify-between w-full px-6">
          <span className="text-foundation-gray-4 font-medium text-sm/[20px]">Remember me</span>
          <Link href="#" className="text-[#FF6D00] text-sm/[20px] font-medium">Forgot password?</Link>
        </div>
      </div>
      <CustomButton type="submit" className="w-full py-3">
        Login
      </CustomButton>
      <div className="flex flex-row items-center gap-2 justify-center">
        <span className="text-foundation-gray-4 font-normal text-sm/[20px]">Don't have an account?</span>
        <Link href="/register" className="text-[#FF6D00] text-sm/[20px] font-medium">Sign up</Link>
      </div>
    </form>
  );
}