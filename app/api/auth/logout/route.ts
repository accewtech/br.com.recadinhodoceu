import { NextResponse } from "next/server";
import { createExpiredSessionCookie } from "../../../../src/shared/auth";

export async function POST() {
  const response = NextResponse.json({ authenticated: false });
  response.headers.set("Set-Cookie", createExpiredSessionCookie());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
