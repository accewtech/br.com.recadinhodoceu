import {
  createHash,
  createHmac,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE_NAME = "recadinho_session";
const SESSION_DURATION_SECONDS = 60 * 60;
const SESSION_ISSUER = "recadinho-do-ceu";
const SESSION_AUDIENCE = "recadinho-do-ceu-web";
const PASSWORD_KEY_LENGTH = 64;

type AuthConfiguration = {
  username: string;
  passwordSalt: Buffer;
  passwordHash: Buffer;
  jwtSecret: Buffer;
};

type SessionClaims = {
  sub: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
};

function getAuthConfiguration(): AuthConfiguration {
  const username = process.env.AUTH_USERNAME;
  const passwordHashValue = process.env.AUTH_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!username || !passwordHashValue || !jwtSecret) {
    throw new Error(
      "AUTH_USERNAME, AUTH_PASSWORD_HASH, and JWT_SECRET must be configured.",
    );
  }

  const [passwordSaltHex, passwordHashHex, ...extraParts] =
    passwordHashValue.split("$");
  if (
    extraParts.length > 0 ||
    !passwordSaltHex ||
    !/^[\da-f]{32}$/i.test(passwordSaltHex) ||
    !passwordHashHex ||
    !/^[\da-f]{128}$/i.test(passwordHashHex)
  ) {
    throw new Error(
      "AUTH_PASSWORD_HASH must contain a 16-byte salt and a 64-byte scrypt hash in hexadecimal, separated by '$'.",
    );
  }

  const secret = Buffer.from(jwtSecret, "utf8");
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes.");
  }

  return {
    username,
    passwordSalt: Buffer.from(passwordSaltHex, "hex"),
    passwordHash: Buffer.from(passwordHashHex, "hex"),
    jwtSecret: secret,
  };
}

function safeCompare(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export async function validateCredentials(username: string, password: string) {
  const config = getAuthConfiguration();
  const actualHash = (await scrypt(
    password,
    config.passwordSalt,
    PASSWORD_KEY_LENGTH,
  )) as Buffer;
  const isValidPassword = timingSafeEqual(actualHash, config.passwordHash);

  return safeCompare(username, config.username) && isValidPassword;
}

function signSessionToken(username: string) {
  const config = getAuthConfiguration();
  const issuedAt = Math.floor(Date.now() / 1000);
  const claims: SessionClaims = {
    sub: username,
    iss: SESSION_ISSUER,
    aud: SESSION_AUDIENCE,
    iat: issuedAt,
    exp: issuedAt + SESSION_DURATION_SECONDS,
  };
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const unsignedToken = `${header}.${payload}`;
  const signature = createHmac("sha256", config.jwtSecret)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}

function verifySessionToken(token: string): SessionClaims | null {
  const config = getAuthConfiguration();
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !/^[\w-]+$/.test(part))) {
    return null;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const expectedSignature = createHmac("sha256", config.jwtSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  const actualSignature = Buffer.from(encodedSignature, "base64url");

  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return null;
  }

  let header: unknown;
  let claims: unknown;
  try {
    header = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString("utf8"),
    );
    claims = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );
  } catch {
    return null;
  }

  if (
    !header ||
    typeof header !== "object" ||
    !("alg" in header) ||
    header.alg !== "HS256" ||
    !claims ||
    typeof claims !== "object"
  ) {
    return null;
  }

  const session = claims as Partial<SessionClaims>;
  const currentTime = Math.floor(Date.now() / 1000);
  if (
    typeof session.sub !== "string" ||
    session.sub !== config.username ||
    session.iss !== SESSION_ISSUER ||
    session.aud !== SESSION_AUDIENCE ||
    typeof session.iat !== "number" ||
    !Number.isInteger(session.iat) ||
    typeof session.exp !== "number" ||
    !Number.isInteger(session.exp) ||
    session.exp <= currentTime ||
    session.iat > currentTime
  ) {
    return null;
  }

  return session as SessionClaims;
}

function getCookieValue(cookieHeader: string | null, name: string) {
  const cookie = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie?.slice(name.length + 1);
}

export function getSessionFromCookieHeader(cookieHeader: string | null) {
  const token = getCookieValue(cookieHeader, SESSION_COOKIE_NAME);
  return token ? verifySessionToken(token) : null;
}

export function createSessionCookie(username: string) {
  const token = signSessionToken(username);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DURATION_SECONDS}${secure}`;
}

export function createExpiredSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}
