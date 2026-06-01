import React, { useState, useEffect } from "react";

type EmailAreaType = "subject" | "body";

interface CustomEmailAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "value"
> {
  className?: string;
  body?: string;
  kind?: EmailAreaType;
  onChange?: (value: string) => void;
}

const kindStyles: Record<EmailAreaType, string> = {
  subject: "text-base font-medium",
  body: "text-sm font-normal",
};

const CustomEmailArea = React.forwardRef<any, CustomEmailAreaProps>(
  ({ className = "", body, kind = "body", onChange, ...rest }, ref) => {
    const [value, setValue] = useState(body ?? "");

    useEffect(() => {
      setValue(body ?? "");
    }, [body]);

    const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
      setValue(e.target.value);
      onChange?.(e.target.value);
    };

    const rows = kind === "subject" ? 2 : ((rest.rows as number) ?? 20);

    return (
      <div className="flex flex-col gap-2 font-inter w-full">
        {kind === "subject" ? (
          <input
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={ref}
            value={value}
            onChange={handleChange}
            className={`outline-none text-sm bg-transparent text-foreground placeholder:text-sm placeholder:text-foundation-gray-4 focus:ring-0 w-full ${kindStyles[kind]} ${className}`}
          />
        ) : (
          <textarea
            {...rest}
            ref={ref}
            value={value}
            rows={rows}
            onChange={handleChange}
            className={`outline-none bg-transparent resize-none text-foreground placeholder:text-sm placeholder:text-foundation-gray-4 focus:ring-0 w-full ${kindStyles[kind]} ${className}`}
          />
        )}
      </div>
    );
  },
);

CustomEmailArea.displayName = "CustomEmailArea";

export default CustomEmailArea;
