import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIntials = (name: string) => {
  const names = name.split(" ");
  if (names.length > 1) {
    return names[0][0] + names[1][0];
  }
  return names[0][0];
};

export const iconCardBg = (icon: string) => {
  switch (icon) {
    case "Open Deals":
      return "bg-[#E8EEFF]";
    case "Revenue Forecast":
      return "bg-[#D8F3F1]";
    case "Active Contacts":
      return "bg-[#E8EEFF]";
    case "Emails Sent":
      return "bg-[#FFE7D5]";
    default:
      return "bg-gray-500";
  }
};
export const iconColor = (icon: string) => {
  switch (icon) {
    case "Open Deals":
      return "#4A90E2";
    case "Revenue Forecast":
      return "#2F9E94";
    case "Active Contacts":
      return "#0041FF";
    case "Emails Sent":
      return "#FF6D00";
    default:
      return "bg-gray-500";
  }
};

export enum ContactTabs {
  ALL = "All",
  HOT = "Hot",
  WARM = "Warm",
  COLD = "Cold",
}
