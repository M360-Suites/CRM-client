"use client";
import React, { useCallback, useState } from "react";
import { XIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CustomDrawerProps {
  trigger: React.ReactNode;
  label?: string;
  // children can be static nodes or a render function that receives `close()`
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CustomDrawer({
  trigger,
  label,
  children,
  defaultOpen = false,
  onOpenChange,
}: CustomDrawerProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const close = useCallback(() => handleOpenChange(false), [handleOpenChange]);

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="font-inter w-full">
        <DrawerHeader className="flex items-center flex-row justify-between w-full px-6 py-5 border-b">
          <DrawerTitle>{label}</DrawerTitle>
          <DrawerClose asChild>
            <button aria-label="Close">
              <XIcon className="cursor-pointer" color="#E2725B" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4 py-8">
          {typeof children === "function" ? children(close) : children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
