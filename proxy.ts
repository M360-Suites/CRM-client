import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/handler";

const PROTECTED_PATHS = [
  "/dashboard",
  "/contacts",
  "/companies",
  "/calendar",
  "/documents",
  "/pipeline",
];

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;
  const fullPath = pathname + nextUrl.search;

  console.log("Middleware checking path:", pathname);
  console.log("Cookies available:", cookies.getAll());
  console.log("Access token cookie:", cookies.get(storage.ACCESS_TOKEN));
  console.log("Raw Cookie header:", request.headers.get("cookie"));
  console.log("Cookies available (parsed):", cookies.getAll());

  const accessToken = cookies.get(storage.ACCESS_TOKEN)?.value;
  const isVerified = cookies.get(storage.IS_VERIFIED)?.value === "true";

  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  console.log("Is protected route:", isProtectedRoute);
  console.log("Access token present:", accessToken);
  console.log("Is user verified:", isVerified);

  // If token is expired or missing on a protected route
  if (isProtectedRoute) {
    // Not authenticated -> require login
    if (!accessToken) {
      const loginUrl = new URL(`/login`, request.url);
      loginUrl.searchParams.set("r", "auth_required");
      const response = NextResponse.redirect(loginUrl);

      // Clear sensitive cookies
      response.cookies.delete(storage.ACCESS_TOKEN);
      response.cookies.delete(storage.IS_VERIFIED);
      response.cookies.delete(storage.LOGGED_IN_USER);
      response.cookies.delete(storage.ACCESS_TOKEN_EXPIRY);

      // Save the originally requested URL for redirect after login
      response.cookies.set(storage.REDIRECT_AFTER_LOGIN, fullPath, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 5, // store for 5 mins
      });

      // optional client-friendly notice (client can read and display)
      response.cookies.set(
        "auth_notice",
        JSON.stringify({
          type: "auth_required",
          message: "Please sign in to access that page.",
        }),
        { path: "/", httpOnly: false, maxAge: 60 * 5 },
      );

      return response;
    }

    // Authenticated but not verified -> prompt verification flow
    if (accessToken && !isVerified) {
      // Try to extract email from stored user cookie if available
      let userEmail = "";
      const rawUser = cookies.get(storage.LOGGED_IN_USER)?.value;
      try {
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          userEmail = parsed?.email ?? "";
        }
      } catch (e) {
        userEmail = "";
      }

      // Redirect to verification page (gracious)
      const verifyUrl = new URL(`/verification`, request.url);
      verifyUrl.searchParams.set("r", "verify_email");
      if (userEmail) verifyUrl.searchParams.set("email", userEmail);

      const response = NextResponse.redirect(verifyUrl);

      // keep redirect-after-login so user returns to intended page post-verification
      response.cookies.set(storage.REDIRECT_AFTER_LOGIN, fullPath, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 5,
      });

      // client-visible notice so the verification page can show a friendly message
      response.cookies.set(
        "auth_notice",
        JSON.stringify({
          type: "verify_email",
          message:
            "Please verify your email to continue. We sent a code to your inbox.",
        }),
        { path: "/", httpOnly: false, maxAge: 60 * 5 },
      );

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/companies/:path*",
    "/calendar/:path*",
    "/documents/:path*",
    "/pipeline/:path*",
  ],
};
