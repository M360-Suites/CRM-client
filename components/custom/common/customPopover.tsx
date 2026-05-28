import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomPopoverProps {
  trigger: React.ReactNode;
  title?: string;
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
}: CustomPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} className="w-fit p-0 font-inter">
        {(title || description) && (
          <div className="px-4 py-3 border-b">
            {title && (
              <span className="text-sm font-medium text-foreground">
                {title}
              </span>
            )}
            {description && (
              <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
            )}
          </div>
        )}
        {children && <div className="p-2">{children}</div>}
      </PopoverContent>
    </Popover>
  );
}
