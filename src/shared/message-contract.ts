export const MESSAGE_COLORS = [
  "#CEF1BF",
  "#FED9F7",
  "#B4DCEB",
  "#96DECE",
  "#FFEB99",
  "#BBB7FB",
  "#FD96A4",
  "#FED9C2",
] as const;

export type MessageColor = (typeof MESSAGE_COLORS)[number];

export type MessageData = {
  gospel?: string;
  book?: string;
  messageOfDay?: string;
  account?: string;
};

export const defaultMessage: MessageData = {
  gospel: "NÃO TE DIGO ATÉ SETE VEZES, MAS ATÉ SETENTA VEZES SETE.",
  book: "(Mateus 18, 22)",
  messageOfDay:
    "Perdoar não é só um gesto, é um ato de amor e liberdade. <mark>Cada vez que liberamos o outro, nos libertamos também</mark>. Hoje, escolha o perdão e veja sua vida se transformar.",
  account: "@recadinhodoceu__",
};

export function getRandomMessageColor(): MessageColor {
  return MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];
}

export function validateMessagePayload(value: unknown): {
  data?: MessageData;
  color?: MessageColor;
  missing: string[];
  hasInvalidColor: boolean;
} {
  if (!value || typeof value !== "object") {
    return {
      missing: ["messageOfDay", "account"],
      hasInvalidColor: false,
    };
  }

  const payload = value as Record<string, unknown>;
  const requiredFields = ["messageOfDay", "account"];
  const missing = requiredFields.filter(
    (field) => typeof payload[field] !== "string" || !payload[field]?.trim(),
  );
  const color = MESSAGE_COLORS.find((candidate) => candidate === payload.color);
  const hasInvalidColor = payload.color !== undefined && !color;

  if (missing.length > 0 || hasInvalidColor) {
    return { missing, hasInvalidColor };
  }

  return {
    data: {
      gospel:
        typeof payload.gospel === "string"
          ? String(payload.gospel).trim()
          : undefined,
      book:
        typeof payload.book === "string"
          ? String(payload.book).trim()
          : undefined,
      messageOfDay:
        typeof payload.messageOfDay === "string"
          ? String(payload.messageOfDay).trim()
          : undefined,
      account:
        typeof payload.account === "string"
          ? String(payload.account).trim()
          : undefined,
    },
    color,
    missing: [],
    hasInvalidColor: false,
  };
}
