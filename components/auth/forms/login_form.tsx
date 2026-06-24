"use client";

import Link from "next/link";
import { loginSchema, type LoginRequestData } from "@/validation/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { CustomButton } from "@/components/custom/common/customButton";
import CustomInput from "@/components/custom/common/customInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/auth/login";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const router = useRouter();
	const { mutate: loginUser, isPending: isLoginLoading } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginRequestData>({
		resolver: zodResolver(loginSchema),
	});
	const onSubmit: SubmitHandler<LoginRequestData> = async (data) => {
		loginUser(data, {
			onSuccess: () => {
				router.push("/dashboard");
			},
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-12 w-full"
		>
			<div className="flex flex-col gap-3 w-full">
				<div className="flex flex-col gap-4 relative">
					<CustomInput
						label="Email address"
						placeholder="you@example.com"
						error={errors.email?.message}
						type="email"
						{...register("email", { required: true })}
					/>
					{errors.email && (
						<span className="text-xs text-foundation-error-6 absolute right-0 -bottom-5">
							{errors.email.message}
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

				<Link
					href="/forgot-password"
					className="text-[#E2725B] text-sm/[20px] self-end font-normal"
				>
					Forgot password?
				</Link>
			</div>
			<CustomButton
				type="submit"
				disabled={isLoginLoading}
				className="w-full py-3.5"
			>
				{isLoginLoading ? "Logging in..." : "Login"}
			</CustomButton>
			<div className="flex flex-row items-center gap-2 justify-center">
				<span className="text-foundation-gray-4 font-normal text-base/[20px]">
					Don&apos;t have an account?
				</span>
				<Link
					href="/register"
					className="text-[#E2725B] text-sm/[20px] font-medium"
				>
					Sign up
				</Link>
			</div>
		</form>
	);
}
