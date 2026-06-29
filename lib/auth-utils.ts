/**
 * Authentication utility functions for server-side token validation
 */

/**
 * Checks if a token expiry date is in the past
 * @param expiryString - ISO date string or timestamp
 * @returns true if expired, false if still valid
 */
export function isTokenExpired(expiryString?: string | null): boolean {
  if (!expiryString) return true;

  try {
    const expiryMs = Number(expiryString);
    const expiryDate = new Date(expiryMs);
    const now = new Date();
    // Check if date is valid
    if (isNaN(expiryDate.getTime())) {
      console.error("Invalid token expiry date:", expiryString);
      return true;
    }

    return expiryDate < now;
  } catch (error) {
    console.error("Error parsing token expiry:", error);
    return true; // Consider expired if we can't parse the date
  }
}

/**
 * Checks if a token is valid (exists and not expired)
 * @param token - The access token
 * @param expiryString - ISO date string or timestamp
 * @returns true if valid, false otherwise
 */
export function isTokenValid(
  token?: string | null,
  expiryString?: string | null,
): boolean {
  console.log("Token:", token, "Expiry:", expiryString);
  if (!token || token.trim() === "") {
    return false;
  }
  return !isTokenExpired(expiryString);
}

/**
 * Get time remaining until token expires in milliseconds
 * @param expiryString - ISO date string or timestamp
 * @returns milliseconds until expiry, or 0 if expired/invalid
 */
export function getTokenTimeRemaining(expiryString?: string | null): number {
  if (!expiryString) return 0;

  try {
    const expiryDate = new Date(expiryString);
    const now = new Date();

    if (isNaN(expiryDate.getTime())) {
      return 0;
    }

    const remaining = expiryDate.getTime() - now.getTime();
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error("Error calculating token time remaining:", error);
    return 0;
  }
}
