import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface CustomOtpInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function CustomOtpInput({
  value,
  onChange,
  error,
}: CustomOtpInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <InputOTP maxLength={5} value={value} onChange={onChange}>
        <InputOTPGroup>
          {Array.from({ length: 5 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="h-20 w-21 rounded-[10px] border border-[#F3D9C4] bg-[#FFF3E6]"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
