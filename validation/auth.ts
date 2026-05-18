import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => val.trim().length > 0, "Password cannot be just spaces"),
});

export const registerSchema = z.object({
  fullname: z.string("Invalid name"),
  email: z.email("Invalid email address"),
  companyName: z.string("Invalid company name"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => val.trim().length > 0, "Password cannot be just spaces"),
});

export const forgotPasswordSchema = z.object({
  email: z.string("Invalid email address"),
});

export const emailVerificationSchema = z.object({
  otp: z.string().min(5, "OTP must be 5 characters"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .refine((val) => val.trim().length > 0, "Password cannot be just spaces"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const onboardingSchema = z.object({
  businessType: z.string().min(1, "Business Type must not be empty"),
  numberOfEmployee: z.string().min(1, "Number of employees cannot be empty"),
  companyLogo: z.string()
})

export type ForgotRequestData = z.infer<typeof forgotPasswordSchema>;
export type ResetRequestData = z.infer<typeof resetPasswordSchema>;
export type EmailVerficationRequestData = z.infer<
  typeof emailVerificationSchema
>;
export type RegisterRequestData = z.infer<typeof registerSchema>;
export type LoginRequestData = z.infer<typeof loginSchema>;
export type OnboardingRequestData = z.infer<typeof onboardingSchema>;
