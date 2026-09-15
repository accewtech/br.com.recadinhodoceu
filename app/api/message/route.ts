import { NextResponse } from "next/server";
import {
  getRandomMessageColor,
  renderMessageSvg,
  validateMessagePayload,
} from "../../message";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "O payload precisa ser um JSON válido." },
      { status: 400 },
    );
  }

  const { data, missing } = validateMessagePayload(payload);
  if (!data) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes ou vazios.", missing },
      { status: 422 },
    );
  }

  return new Response(renderMessageSvg(data, getRandomMessageColor()), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
