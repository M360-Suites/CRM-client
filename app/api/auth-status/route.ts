import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { storage } from "@/lib/handler";
import { isTokenValid } from "@/lib/auth-utils";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(storage.ACCESS_TOKEN)?.value;
  const tokenExpiry = cookieStore.get(storage.ACCESS_TOKEN_EXPIRY)?.value;
  const isVerified = cookieStore.get(storage.IS_VERIFIED)?.value === "true";

  const hasValidToken = isTokenValid(accessToken, tokenExpiry);

  return NextResponse.json({
    isAuthenticated: hasValidToken && isVerified,
    hasToken: hasValidToken,
    isVerified,
  });
}
