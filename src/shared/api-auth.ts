import { NextResponse } from "next/server";
import { getSessionFromCookieHeader } from "./auth";

export function getApiAuthenticationError(cookieHeader: string | null) {
  try {
    if (getSessionFromCookieHeader(cookieHeader)) {
      return null;
    }

    return NextResponse.json(
      { error: "Autenticação necessária." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("API authentication check failed.", error);
    return NextResponse.json(
      { error: "A autenticação está indisponível." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
