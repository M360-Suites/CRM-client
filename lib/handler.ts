export const storage = {
  ACCESS_TOKEN: "crm_AT",
  ACCESS_TOKEN_EXPIRY: "crm_AT_EXPIRY",
  IS_VERIFIED: "crm_IV",
  LOGGED_IN_USER: "crm_USER",
  REDIRECT_AFTER_LOGIN: "crm_REDIRECT_AFTER_LOGIN",
};

export function getRedirectUrl(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^| )${storage.REDIRECT_AFTER_LOGIN}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export function clearRedirectUrl(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${storage.REDIRECT_AFTER_LOGIN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const esc = name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + esc + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}