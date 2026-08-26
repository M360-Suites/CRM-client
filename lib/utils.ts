import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string | null) => {
  if (!name?.trim()) return "N/A";

  const names = name.trim().split(/\s+/).filter(Boolean);
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

export default function getDirtyValues<T extends Record<string, unknown>>(
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

export function formatRelativeDateTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();

  // Normalize to midnight to ensure accurate "day" comparisons
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  // Format the time portion (e.g., "2:40 pm")
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Intl usually adds a space before AM/PM. Remove it and lowercase to match "2:20pm"
  const timeString = timeFormatter.format(date).replace(" ", "").toLowerCase();

  // Compare midnights to determine the relative day
  if (targetDate.getTime() === today.getTime()) {
    return `Today at ${timeString}`;
  }

  if (targetDate.getTime() === yesterday.getTime()) {
    return `Yesterday at ${timeString}`;
  }

  // Fallback for older dates (e.g., "Aug 14 at 2:40pm" or "Aug 14, 2025 at 2:40pm")
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    // Only show the year if it's not the current year
    year:
      targetDate.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });

  return `${dateFormatter.format(date)} at ${timeString}`;
}

export const handleHoursTime = (time: string) => {
  if (!time) return "";

  const date = /^\d+$/.test(time) ? new Date(Number(time)) : new Date(time);

  if (Number.isNaN(date.getTime())) return time;

  const now = new Date();

  // Start of today
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  // Start of the date
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Today
  if (startOfDate.getTime() === startOfToday.getTime()) {
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes < 1) {
        return "Just now";
      }

      return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  // Previous days
  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays > 0 && diffDays <= 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  }

  // Older than 7 days
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
