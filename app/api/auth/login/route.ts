import { NextResponse } from "next/server";
import {
  createSessionCookie,
  validateCredentials,
} from "../../../../src/shared/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Forneça usuário e senha válidos." },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { error: "Forneça usuário e senha válidos." },
      { status: 400 },
    );
  }

  const { username, password } = payload as Record<string, unknown>;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password ||
    username.length > 128 ||
    password.length > 1024
  ) {
    return NextResponse.json(
      { error: "Forneça usuário e senha válidos." },
      { status: 400 },
    );
  }

  try {
    const isValid = await validateCredentials(username.trim(), password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ authenticated: true });
    response.headers.set("Set-Cookie", createSessionCookie(username.trim()));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Authentication login failed.", error);
    return NextResponse.json(
      { error: "A autenticação está indisponível." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
