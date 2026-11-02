import { NextResponse } from "next/server";
import { getSessionFromCookieHeader } from "../../../../src/shared/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = getSessionFromCookieHeader(request.headers.get("cookie"));
    return NextResponse.json(
      {
        authenticated: Boolean(session),
        expiresAt: session ? session.exp * 1000 : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Authentication session check failed.", error);
    return NextResponse.json(
      { error: "A autenticação está indisponível." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
