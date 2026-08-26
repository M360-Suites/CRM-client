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
  action?: React.ReactNode;
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
}

export function CustomPopover({
  trigger,
  title,
  action,
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
        {(title || action) && (
          <div
            className={`px-4 py-3 border-b border-foreground/10 flex flex-row items-center justify-between `}
          >
            {title && (
              <span className={`font-medium text-sm text-foreground`}>
                {title}
              </span>
            )}
            {action && (
              <div className="text-xs text-foreground/50 mt-0.5 hover:cursor-pointer hover:text-foreground/90">
                {action}
              </div>
            )}
          </div>
        )}
        {children && <div className={`px-2 pb-2 ${className}`}>{children}</div>}
      </PopoverContent>
    </Popover>
  );
}
