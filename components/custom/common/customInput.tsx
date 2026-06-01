import React, { useState } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

type CustomInputProps = {
  label: string;
  type?: string;
  error?: string;
  textArea?: boolean;
  className?: string;
} & (
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
);

const CustomInput = React.forwardRef<any, CustomInputProps>(
  ({ label, error, type, className = "", textArea, ...inputProps }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handlePasswordVisibilityToggle = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    const resolvedType =
      type === "password" && isPasswordVisible ? "text" : type;

    return (
      <div className="flex flex-col gap-2 font-inter w-full">
        <label className="text-foreground font-regular text-sm/[120%]">
          {label}
        </label>
        <div
          className={`rounded-[10px] border flex flex-row justify-between items-center ${error ? "border-foundation-error-6" : "border-border"} bg-[#FFF3E6] px-4 py-4.5`}
        >
          {textArea ? (
            <textarea
              {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              ref={ref}
              rows={(inputProps as any).rows ?? 3}
              className={`outline-none bg-transparent resize-none text-base text-foreground placeholder:text-sm placeholder:text-foundation-gray-4 focus:ring-0 w-full ${className}`}
            />
          ) : (
            <input
              {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
              type={resolvedType}
              ref={ref}
              className={`outline-none bg-transparent text-base text-foreground placeholder:text-sm placeholder:text-foundation-gray-4 focus:ring-0 w-full ${className}`}
            />
          )}

          {!textArea &&
            type === "password" &&
            (isPasswordVisible ? (
              <EyeIcon
                color="#48494F"
                className="cursor-pointer"
                size="20px"
                onClick={handlePasswordVisibilityToggle}
              />
            ) : (
              <EyeClosedIcon
                color="#777777"
                className="cursor-pointer"
                size="20px"
                onClick={handlePasswordVisibilityToggle}
              />
            ))}
        </div>
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
