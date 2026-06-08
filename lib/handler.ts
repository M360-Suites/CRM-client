import Cookies from "js-cookie";

export const storage = {
  ACCESS_TOKEN: "crm_AT",
  ACCESS_TOKEN_EXPIRY: "crm_AT_EXPIRY",
  IS_VERIFIED: "crm_IV",
  LOGGED_IN_USER: "crm_USER",
  REDIRECT_AFTER_LOGIN: "crm_REDIRECT_AFTER_LOGIN",
};

export function getRedirectUrl(): string | null {
  if (typeof document === "undefined") return null;
  const redirectUrl = Cookies.get(storage.REDIRECT_AFTER_LOGIN);
  return redirectUrl || null;
}

export function clearRedirectUrl(): void {
  if (typeof document === "undefined") return;
  Cookies.remove(storage.REDIRECT_AFTER_LOGIN);
}

export function downloadFile(data: string, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseDateWithTime(utcString?: string) {
  if (!utcString) {
    return { date: " ", month: " ", time: " " };
  }

  const d = new Date(utcString);
  if (isNaN(d.getTime())) {
    return { date: " ", month: " ", time: " " };
  }

  const date = String(d.getDate());
  const month = d.toLocaleString("en-US", { month: "long" }) || " ";
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const time = `${String(hours).padStart(1)} ${ampm}`;

  return { date, month, time };
}
