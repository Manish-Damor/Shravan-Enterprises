const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();
const JWT_SECRET = process.env.JWT_SECRET || "local-secret";
const HASH_ITERATIONS = 180000;
const HASH_ALGO = "SHA-256";
const HASH_KEYLEN = 32;

function getRandomBytes(length: number): Uint8Array {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buffer = new Uint8Array(length);
    crypto.getRandomValues(buffer);
    return buffer;
  }
  throw new Error("No secure random generator available.");
}

function btoaSafe(value: string) {
  if (typeof btoa === "function") return btoa(value);
  if (typeof Buffer !== "undefined") return Buffer.from(value, "binary").toString("base64");
  throw new Error("No base64 encoder available.");
}

function atobSafe(value: string) {
  if (typeof atob === "function") return atob(value);
  if (typeof Buffer !== "undefined") return Buffer.from(value, "base64").toString("binary");
  throw new Error("No base64 decoder available.");
}

function base64UrlEncode(data: Uint8Array) {
  let binary = "";
  for (let i = 0; i < data.length; i += 1) {
    binary += String.fromCharCode(data[i]);
  }
  const base64 = btoaSafe(binary);
  return base64.replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atobSafe(padded);
  const result = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    result[i] = binary.charCodeAt(i);
  }
  return result;
}

async function getHmacKey() {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function pbkdf2(password: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    ENCODER.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: HASH_ITERATIONS,
      hash: HASH_ALGO,
    },
    keyMaterial,
    HASH_KEYLEN * 8,
  );

  return new Uint8Array(derived);
}

export async function hashPassword(password: string) {
  const salt = getRandomBytes(16);
  const hash = await pbkdf2(password, salt);
  return `pbkdf2$${HASH_ITERATIONS}$${base64UrlEncode(salt)}$${base64UrlEncode(hash)}`;
}

export async function comparePassword(password: string, stored: string) {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = base64UrlDecode(parts[2]);
  const expectedHash = base64UrlDecode(parts[3]);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    ENCODER.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: HASH_ALGO,
    },
    keyMaterial,
    expectedHash.byteLength * 8,
  );

  const hash = new Uint8Array(derived);
  if (hash.length !== expectedHash.length) return false;

  let diff = 0;
  for (let i = 0; i < hash.length; i += 1) {
    diff |= hash[i] ^ expectedHash[i];
  }
  return diff === 0;
}

export async function createAuthToken(payload: Record<string, unknown>, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = base64UrlEncode(ENCODER.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const now = Math.floor(Date.now() / 1000);
  const body = base64UrlEncode(
    ENCODER.encode(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds })),
  );
  const key = await getHmacKey();
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    ENCODER.encode(`${header}.${body}`),
  );
  const signature = base64UrlEncode(new Uint8Array(signatureBytes));
  return `${header}.${body}.${signature}`;
}

export async function verifyAuthToken(token: string) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;

  const key = await getHmacKey();
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signature),
    ENCODER.encode(`${header}.${body}`),
  );
  if (!valid) return null;

  const payload = JSON.parse(DECODER.decode(base64UrlDecode(body)));
  if (typeof payload !== "object" || payload === null) return null;
  const { exp } = payload as { exp?: number };
  if (typeof exp !== "number" || exp < Math.floor(Date.now() / 1000)) return null;
  return payload as Record<string, unknown>;
}
