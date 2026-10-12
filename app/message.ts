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
  const cardX = 130;
  const cardY = 253;
  const cardWidth = 636;
  const cardHeight = 678;
  const contentX = 210;
  const gospelY = 373;
  const gospelLines = wrapText(data.gospel.toUpperCase(), 31);
  const bodyLines = wrapText(data.messageOfDay, 31);
  const gospelMarkup = gospelLines
    .map(
      (line, index) =>
        `<text x="${contentX}" y="${gospelY + index * 40}" class="gospel">${escapeXml(line)}</text>`,
    )
    .join("");
  const referenceY = gospelY + gospelLines.length * 40 + 4;
  const bodyY = referenceY + 68;
  const bodyMarkup = bodyLines
    .map(
      (line, index) =>
        `<rect x="${contentX}" y="${bodyY - 27 + index * 39}" width="${Math.min(line.length * 15 + 8, 470)}" height="35" fill="${color}"/>\n        <text x="${contentX}" y="${bodyY + index * 39}" class="body">${escapeXml(line)}</text>`,
    )
    .join("");
  const logoY = cardY + cardHeight - 104;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="896" height="1120" viewBox="0 0 896 1120">
  <rect width="896" height="1120" fill="${color}"/>
  <image href="/assets/card%203.png" x="${cardX + 51}" y="${cardY - 85}" width="${cardWidth - 102}" height="48" preserveAspectRatio="none"/>
  <image href="/assets/card%202.png" x="${cardX + 22}" y="${cardY - 43}" width="${cardWidth - 44}" height="48" preserveAspectRatio="none"/>
  <image href="/assets/card%201.png" x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" preserveAspectRatio="none"/>
  <g font-family="'Bona Nova SC', Georgia, serif" fill="#172d32">
    ${gospelMarkup}
    <text x="${contentX}" y="${referenceY}" class="gospel book">${escapeXml(formatBook(data.book))}</text>
  </g>
  <g font-family="Arial, Helvetica, sans-serif" fill="#111">
    ${bodyMarkup}
  </g>
  <image href="/assets/logo.png" x="${contentX}" y="${logoY}" width="160" height="44" preserveAspectRatio="xMinYMid meet"/>
  <style>
    .gospel { font-size: 29px; font-weight: 700; }
    .book { font-size: 28px; }
    .body { font-size: 27px; }
  </style>
</svg>`;
}
