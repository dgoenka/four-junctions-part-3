import { NextRequest, NextResponse } from "next/server";

export async function logout(request: NextRequest) {
  try {
    const response = NextResponse.redirect(new URL("/login", request.nextUrl));
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
