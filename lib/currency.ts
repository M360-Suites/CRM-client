export const CURRENCIES = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// The app showed every value in naira before deals carried a currency
export const DEFAULT_CURRENCY: CurrencyCode = "NGN";

export const currencySymbol = (code?: string | null) =>
  CURRENCIES.find((c) => c.code === code?.toUpperCase())?.symbol ??
  (code ? `${code.toUpperCase()} ` : "₦");

export const formatMoney = (value?: number | null, currency?: string | null) =>
  `${currencySymbol(currency ?? DEFAULT_CURRENCY)}${(value ?? 0).toLocaleString()}`;

/**
 * Turns whatever was typed into a clean numeric string (digits plus at most
 * one decimal point and two decimals), and its comma-grouped display form.
 */
export const parseAmountInput = (raw: string) => {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const [intPart = "", ...rest] = cleaned.split(".");
  const hasDecimal = rest.length > 0;
  const decimals = rest.join("").slice(0, 2);
  const int = intPart.replace(/^0+(?=\d)/, "");
  const numeric = hasDecimal ? `${int || "0"}.${decimals}` : int;
  const display = int
    ? `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${hasDecimal ? `.${decimals}` : ""}`
    : hasDecimal
      ? `0.${decimals}`
      : "";
  return { numeric, display };
};

export const formatAmountInput = (value?: number | string | null) =>
  value === undefined || value === null || value === ""
    ? ""
    : parseAmountInput(String(value)).display;
