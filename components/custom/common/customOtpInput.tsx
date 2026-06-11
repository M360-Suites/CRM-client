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
    // <div className="flex flex-col gap-2">
    <InputOTP
      maxLength={5}
      value={value}
      onChange={onChange}
      className="w-full"
    >
      <InputOTPGroup className="">
        {Array.from({ length: 5 }).map((_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="h-[clamp(3rem,5vw+2.5rem,5rem)] w-[clamp(3rem,5vw+2.5rem,5.25rem)] rounded-[10px] border border-[#F3D9C4] bg-[#FFF3E6]"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
    // {error && <span className="text-xs text-red-500">{error}</span>}
    // </div>
  );
}
