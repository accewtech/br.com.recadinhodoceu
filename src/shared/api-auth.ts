import { NextResponse } from "next/server";
import { getSessionFromCookieHeader, getSessionFromToken } from "./auth";

export function getApiAuthenticationError(headers: Headers) {
  try {
    const authorization = headers.get("authorization");
    const bearerToken = authorization?.match(/^Bearer[ \t]+(\S+)$/i)?.[1];
    const session =
      authorization !== null
        ? getSessionFromToken(bearerToken ?? null)
        : getSessionFromCookieHeader(headers.get("cookie"));

    if (session) {
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
