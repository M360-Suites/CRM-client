import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomPopoverProps {
  trigger: React.ReactNode;
  title?: string;
  className?: string;
  popoverClassname?: string;
  description?: string;
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
}

export function CustomPopover({
  trigger,
  title,
  description,
  children,
  align = "end",
  className,
  popoverClassname,
}: CustomPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        className={`w-fit h-full p-0 font-inter ${popoverClassname}`}
      >
        {(title || description) && (
          <div className="px-4 py-3 border-b">
            {title && (
              <span className="text-xs font-medium text-foreground">
                {title}
              </span>
            )}
            {description && (
              <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
            )}
          </div>
        )}
        {children && <div className={`px-2 pb-2 ${className}`}>{children}</div>}
      </PopoverContent>
    </Popover>
  );
}
