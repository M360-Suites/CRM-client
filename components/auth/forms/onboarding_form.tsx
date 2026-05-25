"use client";

import {
  onboardingSchema,
  type OnboardingRequestData,
} from "@/validation/auth";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomSelect } from "@/components/custom/common/customSelect";
import CustomUpload from "@/components/custom/common/customUpload";
import CustomInput from "@/components/custom/common/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/stores/auth/auth_store";
import { zodResolver } from "@hookform/resolvers/zod";

const employeesData = [
  {
    name: "0 - 50",
    value: "0-50",
  },
  {
    name: "50 - 100",
    value: "50-100",
  },
];

export default function OnboardingForm() {
  const { onboardingStep, setOnboardingStep } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingRequestData>({
    resolver: zodResolver(onboardingSchema),
  });
  const onSubmit: SubmitHandler<OnboardingRequestData> = (data) =>
    console.log(data);
  console.log("Current Steps:", onboardingStep);

  const handleSignup = () => {
    if (onboardingStep === 1) {
      setOnboardingStep(onboardingStep + 1);
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
        {onboardingStep === 1 && (
          <div className="flex flex-col gap-4 relative">
            <CustomInput
              label="Business Type"
              placeholder="Enter your business type"
              error={errors.businessType?.message}
              type="text"
              {...(register("businessType"), { required: true })}
            />
            {/*{errors.email && (
              <span className="text-xs text-foundation-error-6 absolute top-1 right-4">
                {errors.email.message}
              </span>
            )}*/}
            <div className="flex flex-col gap-2 relative">
              {/* <CustomSelect
                label="Number of Employees"
                selectable={employeesData}
                placeholder="Select number of employees"
                error={errors.numberOfEmployee?.message}
                {...register("numberOfEmployee", { required: true })}
              /> */}
              {/*{errors.password && (
                <span className="text-xs text-foundation-error-6 absolute left-4 top-1">
                  {errors.password.message}
                </span>
              )}*/}
            </div>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="flex flex-col gap-4 relative">
            <CustomUpload
              label="Upload Company's logo"
              //   placeholder="Enter your company name"
              message="Max file size 5MB"
              onUpload={() => {}}
              //   error={errors.companyLogo?.message}
              {...register("companyLogo")}
            />
            {/*{errors.email && (
              <span className="text-xs text-foundation-error-6 absolute top-1 right-4">
                {errors.email.message}
              </span>
            )}*/}
          </div>
        )}
      </div>
      <CustomButton
        type="submit"
        className="w-full py-3"
        onClick={handleSignup}
      >
        {onboardingStep === 1 ? "Continue" : "Submit"}
      </CustomButton>
    </form>
  );
}
