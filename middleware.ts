import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Pathsinfo } from "@/pathsinfo";
import { logout } from "@/util/logout";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/logout") {
    return logout(request);
  }

  // Define paths that are considered public (accessible without a token)
  const pathInfoObj = Pathsinfo.find((pathObj) => pathObj.path === path);

  if (!pathInfoObj)
    return NextResponse.json({ error: "Path not found" }, { status: 404 });

  const isPublicPath = pathInfoObj?.public;

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";

  if (!isPublicPath && pathInfoObj?.isApi && !token)
    return NextResponse.json({ error: "Unauthorised" }, { status: 400 });

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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
