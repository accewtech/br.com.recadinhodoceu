import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.type !== "image/png") {
      return NextResponse.json(
        { error: "Envie uma imagem PNG válida." },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "A imagem deve ter entre 1 byte e 10 MB." },
        { status: 400 },
      );
    }

    const blob = await put(
      `recadinho-do-ceu/${crypto.randomUUID()}.png`,
      file,
      {
        access: "private",
        contentType: "image/png",
        addRandomSuffix: false,
      },
    );

    return NextResponse.json({ pathname: blob.pathname });
  } catch (error) {
    console.error("[v0] Falha ao salvar imagem no Blob:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar a imagem." },
      { status: 500 },
    );
  }
}
