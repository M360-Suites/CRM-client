"use client";

import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import { useTasksAndCalendarStore } from "@/stores/tasks_calendars/task_calendare_store";
import { PlusIcon, List, CalendarDays } from "lucide-react";
import AddTaskForm from "./form/add_task";

interface Tab {
  label: string;
  value: "list" | "calendar";
  icon: React.ComponentType<any>;
}

const tabs: Tab[] = [
  { label: "List", value: "list", icon: List },
  { label: "Calendar", value: "calendar", icon: CalendarDays },
];

export default function Header() {
  const { activeTab, setActiveTab } = useTasksAndCalendarStore();
  return (
    <div className="w-full pt-8">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium text-[#3A2418]">
            Task & Calendar
          </h2>
          <span className="text-base font-medium text-foreground">
            Plan your week, assign teammates, never miss a follow-up
          </span>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex flex-row items-center gap-2 border border-[#F3D9C4] rounded-full py-2 px-2.5 ">
            {tabs.map((tab) => (
              <CustomButton
                key={tab.value}
                variant={tab.value === activeTab ? "default" : "outline"}
                onClick={() => {
                  console.log("clicking tab:", tab.value);
                  setActiveTab(tab.value);
                }}
                className="rounded-full flex text-sm font-medium flex-row items-center gap-1.5 px-4 py-2 border-none"
              >
                {tab.icon && <tab.icon className="" />}
                {tab.label}
              </CustomButton>
            ))}
          </div>
          <CustomDrawer
            label="Add Task"
            trigger={
              <CustomButton
                variant="default"
                className="rounded-full flex flex-row items-center gap-3 px-12 py-2"
              >
                <PlusIcon className="" />
                <span>New</span>
              </CustomButton>
            }
          >
            {(close) => <AddTaskForm onSuccess={close} />}
          </CustomDrawer>
        </div>
      </div>
    </div>
  );
}
