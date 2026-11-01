"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Dices, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import {
  defaultMessage,
  getRandomMessageColor,
  MESSAGE_COLORS,
  type MessageColor,
  type MessageData,
} from "../message";
import { MessageCardV2 } from "../message-card-v2";

export default function MessageV2() {
  const [message, setMessage] = useState<MessageData>(defaultMessage);
  const [color, setColor] = useState<MessageColor>(MESSAGE_COLORS[1]);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColor(getRandomMessageColor());
  }, []);

  const updateMessage = (field: keyof MessageData, value: string) => {
    setMessage((current) => ({ ...current, [field]: value }));
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setLoading(true);
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(previewRef.current, {
        canvasHeight: 1350,
        canvasWidth: 1080,
        pixelRatio: 1,
        quality: 1,
      });

      const link = document.createElement("a");
      link.download = "recadinho-do-ceu-v2.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="workspace">
      <section className="editor-panel">
        <nav className="version-nav" aria-label="Versão da interface">
          <a href="/v1">v1</a>
          <a aria-current="page" href="/v2">
            v2
          </a>
        </nav>
        <div className="eyebrow">RECADO DO DIA · V2</div>
        <h1>Crie um recadinho para compartilhar.</h1>
        <p className="intro">
          Formate a mensagem com Markdown e visualize o resultado antes de
          baixar.
        </p>

        <div className="fields">
          <label>
            Evangelho
            <textarea
              value={message.gospel}
              onChange={(event) => updateMessage("gospel", event.target.value)}
              rows={3}
            />
          </label>
          <label>
            Livro e versículo
            <input
              value={message.book}
              onChange={(event) => updateMessage("book", event.target.value)}
            />
          </label>
          <label>
            Mensagem do dia
            <textarea
              aria-describedby="markdown-help"
              value={message.messageOfDay}
              onChange={(event) =>
                updateMessage("messageOfDay", event.target.value)
              }
              rows={5}
            />
            <span className="markdown-help" id="markdown-help">
              Markdown: **negrito**, *itálico* e{" "}
              {"<mark>trecho destacado</mark>"}.
            </span>
          </label>
          <label>
            Conta
            <input
              value={message.account}
              onChange={(event) => updateMessage("account", event.target.value)}
            />
          </label>
        </div>

        <div className="color-picker">
          <span>Cor de fundo</span>
          <div className="swatches">
            {MESSAGE_COLORS.map((swatch) => (
              <button
                aria-label={`Usar cor ${swatch}`}
                className={color === swatch ? "swatch selected" : "swatch"}
                key={swatch}
                onClick={() => setColor(swatch)}
                style={{ backgroundColor: swatch }}
                type="button"
              />
            ))}
          </div>
          <button
            className="random-button"
            onClick={() => setColor(getRandomMessageColor())}
            type="button"
          >
            <Dices size={16} /> Sortear
          </button>
        </div>

        <button
          className="download-button"
          disabled={loading}
          onClick={handleDownload}
          type="button"
        >
          {loading ? (
            <RefreshCw className="spin" size={18} />
          ) : (
            <Download size={18} />
          )}
          {loading ? "Gerando imagem..." : "Baixar imagem PNG"}
        </button>

        <div className="api-note">
          <strong>API da v2 disponível</strong>
          <code>POST /api/v2/message</code>
          <span>
            Gera um arquivo WebP com suporte a Markdown e destaque por{" "}
            {"<mark>"}.
          </span>
        </div>
      </section>

      <section className="preview-panel">
        <div className="preview-heading">
          <span>Visualização · v2</span>
          <span>1080 × 1350</span>
        </div>
        <MessageCardV2
          color={color}
          key={JSON.stringify([color, message])}
          message={message}
          previewRef={previewRef}
        />
      </section>
    </main>
  );
}
