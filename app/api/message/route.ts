import { NextResponse } from "next/server";
import { getRandomMessageColor, validateMessagePayload } from "../../message";
import { renderMessageWebp } from "../../message-image";

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
    const image = await renderMessageWebp(
      data,
      color ?? getRandomMessageColor(),
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
