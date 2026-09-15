"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Dices, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import {
  defaultMessage,
  getRandomMessageColor,
  MESSAGE_COLORS,
  type MessageData,
} from "./message";

export default function Home() {
  const [message, setMessage] = useState<MessageData>(defaultMessage);
  const [color, setColor] = useState<string>(MESSAGE_COLORS[1]);
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
      const dataUrl = await toPng(previewRef.current, {
        canvasHeight: 1080,
        canvasWidth: 1350,
        pixelRatio: 2,
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = "recadinho-do-ceu.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="workspace">
      <section className="editor-panel">
        <div className="eyebrow">RECADO DO DIA</div>
        <h1>Crie um recadinho para compartilhar.</h1>
        <p className="intro">
          Preencha os campos e escolha uma cor para gerar a imagem no formato do
          exemplo.
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
              value={message.messageOfDay}
              onChange={(event) =>
                updateMessage("messageOfDay", event.target.value)
              }
              rows={5}
            />
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
          <strong>API disponível</strong>
          <code>POST /api/message</code>
          <span>Retorna a arte como SVG.</span>
        </div>
      </section>

      <section className="preview-panel">
        <div className="preview-heading">
          <span>Visualização</span>
          <span>1350 × 1080</span>
        </div>
        <div
          className="preview-frame"
          ref={previewRef}
          style={{ backgroundColor: color }}
        >
          <div className="card-stack">
            <article className="card">
              <header>
                <h1 className="verse-title">
                  {message.gospel.toUpperCase()}
                  <span className="verse-reference">
                    ({message.book.replace(/^\(|\)$/g, "")})
                  </span>
                </h1>
              </header>
              <div className="reflection">
                <span className="highlight">{message.messageOfDay}</span>
              </div>
              <footer className="footer">{message.account}</footer>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
