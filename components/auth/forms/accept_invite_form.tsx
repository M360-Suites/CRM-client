
"use client";

import { resetPasswordSchema, type ResetRequestData } from "@/validation/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { CustomButton } from "@/components/custom/common/customButton";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/custom/common/customInput";
import useAcceptInvitation from "@/hooks/user/accept_invitations"

interface AcceptInviteFormProps {
  invitationToken?: string | null;
  displayName?: string | null;
}

export default function AcceptInviteForm({ invitationToken, displayName }: AcceptInviteFormProps) {
  const {mutate: acceptInvitation, isPending: isAcceptingInvite} = useAcceptInvitation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetRequestData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit: SubmitHandler<ResetRequestData> = (data) => {
    
    if (invitationToken && displayName) {
      console.log("Accepting invitation with token:", invitationToken, "and display name:", displayName);
      acceptInvitation({ invitationToken, display_name: displayName, password: data.newPassword });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 w-lg max-w-full"
    >
      <div className="flex flex-col gap-5 w-full pb-14">
        <div className="flex flex-col gap-4 relative">
          <CustomInput
            label="New Password"
            placeholder=""
            error={errors.newPassword?.message}
            type="password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className="text-xs text-foundation-error-6 absolute -bottom-5 right-0">
              {errors.newPassword.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-4 relative">
          <CustomInput
            label="Confirm Password"
            placeholder=""
            error={errors.confirmPassword?.message}
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-foundation-error-6 absolute -bottom-5 left-0">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </div>
      <CustomButton
        type="submit"
        disabled={ isAcceptingInvite}
        className="w-full py-3.5"
      >
        {isAcceptingInvite ? "setting password..." : "Set password"}
      </CustomButton>
    </form>
  );
}
