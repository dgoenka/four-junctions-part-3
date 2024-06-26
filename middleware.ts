import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Pathsinfo } from "@/pathsinfo";

const PUBLIC_PATHS = Pathsinfo.filter((path) => path.public);

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that are considered public (accessible without a token)
  const isPublicPath = PUBLIC_PATHS.some((pathObj) => pathObj.path === path);

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  // Redirect logic based on the path and token presence
  if (isPublicPath && token) {
    // If trying to access a public path with a token, redirect to the home page
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  // If trying to access a protected path without a token, redirect to the login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  return NextResponse.next({
    request: {
      // New request headers
      headers,
    },
  });
}

// It specifies the paths for which this middleware should be executed.
// In this case, it's applied to '/', '/profile', '/login', and '/signup'.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
