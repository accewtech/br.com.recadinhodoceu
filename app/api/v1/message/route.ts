import { NextResponse } from "next/server";
import {
  getRandomMessageColor,
  renderMessageCardMarkup,
} from "../../../../src/v1/message";
import { validateMessagePayload } from "../../../../src/shared/message-contract";
import { renderMessageWebpMarkup } from "../../../../src/shared/message-image";

export const runtime = "nodejs";

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

  const { data, color, missing, hasInvalidColor } =
    validateMessagePayload(payload);
  if (!data) {
    return NextResponse.json(
      {
        error: hasInvalidColor
          ? "A cor precisa ser um valor válido da paleta."
          : "Campos obrigatórios ausentes ou vazios.",
        missing,
      },
      { status: 422 },
    );
  }

  try {
    const markup = renderMessageCardMarkup(data);
    const image = await renderMessageWebpMarkup(
      markup,
      color ?? getRandomMessageColor(),
      "v1",
    );

    return new Response(Buffer.from(image), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition":
          'attachment; filename="message-from-heaven.webp"',
        "Content-Type": "image/webp",
      },
    });
  } catch (error) {
    console.error("Failed to render message image:", error);
    return NextResponse.json(
      { error: "Não foi possível gerar a imagem." },
      { status: 500 },
    );
  }
}
