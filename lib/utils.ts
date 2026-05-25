import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string | null) => {
  if (!name?.trim()) return "?";

  const names = name.trim().split(" ");
  if (names.length > 1) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

export const handleGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

export const handleTime = (time: string) => {
  if (!time) return "";

  // accept numeric timestamps or date strings/ISO
  const date = /^\d+$/.test(time) ? new Date(Number(time)) : new Date(time);

  if (Number.isNaN(date.getTime())) return time;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

export default function getDirtyValues<T extends Record<string, any>>(
  dirtyFields: Partial<Record<keyof T, boolean | object>>,
  values: T,
): Partial<T> {
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [key, values[key as keyof T]]),
  ) as Partial<T>;
}
