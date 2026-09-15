export const MESSAGE_COLORS = [
  "#FCF8F6",
  "#CEF1BF",
  "#FED9F7",
  "#B4DCEB",
  "#96DECE",
  "#FFEB99",
  "#BBB7FB",
  "#FD96A4",
  "#FED9C2",
] as const;

export type MessageData = {
  gospel: string;
  book: string;
  messageOfDay: string;
  account: string;
};

export const defaultMessage: MessageData = {
  gospel: "NÃO TE DIGO ATÉ SETE VEZES, MAS ATÉ SETENTA VEZES SETE.",
  book: "(Mateus 18, 22)",
  messageOfDay:
    "Perdoar não é só um gesto, é um ato de amor e liberdade. Cada vez que liberamos o outro, nos libertamos também. Hoje, escolha o perdão e veja sua vida se transformar.",
  account: "@recadinhodoceu__",
};

export function getRandomMessageColor() {
  return MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];
}

export function validateMessagePayload(value: unknown): {
  data?: MessageData;
  missing: string[];
} {
  if (!value || typeof value !== "object") {
    return { missing: ["gospel", "book", "messageOfDay", "account"] };
  }

  const payload = value as Record<string, unknown>;
  const requiredFields = ["gospel", "book", "messageOfDay", "account"];
  const missing = requiredFields.filter(
    (field) => typeof payload[field] !== "string" || !payload[field]?.trim(),
  );

  if (missing.length > 0) return { missing };

  return {
    data: {
      gospel: String(payload.gospel).trim(),
      book: String(payload.book).trim(),
      messageOfDay: String(payload.messageOfDay).trim(),
      account: String(payload.account).trim(),
    },
    missing: [],
  };
}

function escapeXml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&apos;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function wrapText(text: string, maxCharacters: number) {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(/\s+/)) {
    const nextLine = line ? `${line} ${word}` : word;
    if (nextLine.length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function formatBook(book: string) {
  const value = book.replace(/^\(|\)$/g, "").trim();
  return `(${value})`;
}

export function renderMessageSvg(
  data: MessageData,
  color = getRandomMessageColor(),
) {
  const gospelLines = wrapText(data.gospel.toUpperCase(), 32);
  const bodyLines = wrapText(data.messageOfDay, 42);
  const gospelMarkup = gospelLines
    .map(
      (line, index) =>
        `<text x="260" y="${330 + index * 42}" class="gospel">${escapeXml(line)}</text>`,
    )
    .join("");
  const bodyMarkup = bodyLines
    .map(
      (line, index) =>
        `<text x="260" y="${590 + index * 44}" class="body">${escapeXml(line)}</text>`,
    )
    .join("");
  const bodyHighlightHeight = Math.max(52, bodyLines.length * 44 + 12);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1350" height="1080" viewBox="0 0 1350 1080">
  <rect width="1350" height="1080" fill="${color}"/>
  <rect x="300" y="142" width="750" height="58" rx="12" fill="#7d9673" opacity=".8"/>
  <rect x="242" y="200" width="866" height="44" rx="12" fill="#e4ece0"/>
  <rect x="185" y="230" width="980" height="760" rx="14" fill="#fafbf9"/>
  <g font-family="Georgia, serif" fill="#070707">
    ${gospelMarkup}
    <text x="260" y="${330 + gospelLines.length * 42}" class="gospel book">${escapeXml(formatBook(data.book))}</text>
  </g>
  <rect x="256" y="570" width="838" height="${bodyHighlightHeight}" rx="2" fill="#d1f3bd"/>
  <g font-family="Arial, Helvetica, sans-serif" fill="#111">
    ${bodyMarkup}
    <text x="260" y="${760 + bodyLines.length * 44}" class="account">${escapeXml(data.account)}</text>
  </g>
  <style>
    .gospel { font-size: 25px; font-weight: 700; }
    .book { font-size: 24px; }
    .body { font-size: 25px; }
    .account { font-size: 18px; }
  </style>
</svg>`;
}
