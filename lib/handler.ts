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
