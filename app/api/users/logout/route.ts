import { NextRequest } from "next/server";
import { logout } from "@/util/logout";

export async function GET(request: NextRequest) {
  return await logout(request);
}
