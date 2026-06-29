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
    case "Pipeline Value":
    case "Lead Conv.":
      return "bg-[#E8EEFF]";
    case "Revenue":
    case "Won Revenue":
    case "Tasks":
    case "Total Deals":
      return "bg-[#D8F3F1]";
    case "Contacts":
    case "Avg. Cycle":
    case "Won":
      return "bg-[#E8EEFF]";
    case "Companies":
    case "Win Rate":
    case "Lost":
      return "bg-[#FFE7D5]";
    default:
      return "bg-gray-500";
  }
};

export const iconColor = (icon: string) => {
  switch (icon) {
    case "Open Deals":
    case "Pipeline Value":
    case "Lead Conv.":
      return "#4A90E2";
    case "Revenue":
    case "Won Revenue":
    case "Tasks":
    case "Total Deals":
      return "#2F9E94";
    case "Contacts":
    case "Avg. Cycle":
    case "Won":
      return "#0041FF";
    case "Companies":
    case "Win Rate":
    case "Lost":
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

export enum PipelineTabs {
  LEADS = "leads",
  QUALIFIED = "qualified",
  PROPOSALS = "proposals",
  NEGOTIATIONS = "negotiations",
  WON = "won",
  LOST = "lost",
  CLOSED = "closed",
}

export default function getDirtyValues<T extends Record<string, any>>(
  dirtyFields: Partial<Record<keyof T, boolean | object>>,
  values: T,
): Partial<T> {
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [key, values[key as keyof T]]),
  ) as Partial<T>;
}

export function toUTC(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = /^\d+$/.test(dateStr)
    ? new Date(Number(dateStr))
    : new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr || "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNaira(
  input?: number | string | null,
  opts?: { decimals?: number; showSymbol?: boolean },
): string {
  const { decimals = 0, showSymbol = true } = opts ?? {};

  if (input == null || input === "") {
    const zero = (0).toLocaleString("en-NG", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${showSymbol ? "₦" : ""}${zero}`;
  }

  const n =
    typeof input === "string"
      ? Number(String(input).replace(/[^0-9.-]+/g, ""))
      : Number(input);

  if (!Number.isFinite(n)) {
    const zero = (0).toLocaleString("en-NG", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${showSymbol ? "₦" : ""}${zero}`;
  }

  const absFmt = Math.abs(n).toLocaleString("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${n < 0 ? "-" : ""}${showSymbol ? "₦" : ""}${absFmt}`;
}

export const handleRoleDisplay = (role: string) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "sales_manager":
      return "Sales Manager";
    case "sales_rep":
      return "Sales Rep";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
};
