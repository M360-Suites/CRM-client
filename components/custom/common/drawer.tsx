import { Button } from "@/components/ui/button";
import { X, XIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CustomDrawerProps {
  trigger: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

export function CustomDrawer({ trigger, label, children }: CustomDrawerProps) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="font-inter">
        <DrawerHeader className="flex flex-row items-center justify-between w-full px-6 py-5 border-b">
          <DrawerTitle>{label}</DrawerTitle>
          <DrawerClose asChild>
            <XIcon className="cursor-pointer" color="#E2725B" />
          </DrawerClose>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 py-8">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
