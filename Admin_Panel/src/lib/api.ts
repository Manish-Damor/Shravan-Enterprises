const AUTH_TOKEN_KEY = "wwk_auth_token";
let ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL?.trim() ?? import.meta.env.VITE_ADMIN_API_BASE_URL?.trim() ?? import.meta.env.VITE_API_URL?.trim() ?? import.meta.env.VITE_PUBLIC_API_BASE_URL?.trim() ?? "";
const IIS_BACKEND_PORT = "8083";
const DEV_FRONTEND_PORTS = new Set(["8094", "8095"]);

// During local development talk directly to the backend API server.
if (import.meta.env.DEV && !ADMIN_API_BASE_URL) {
  ADMIN_API_BASE_URL = "http://localhost:8082";
}

function getResolvedAdminApiBaseUrl() {
  if (ADMIN_API_BASE_URL) return ADMIN_API_BASE_URL;
  if (typeof window === "undefined") return "";

  const { protocol, hostname, port } = window.location;
  if (!hostname) return "";

  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname);
  const backendPort = isLocalHost && DEV_FRONTEND_PORTS.has(port) ? "8082" : IIS_BACKEND_PORT;
  return `${protocol}//${hostname}:${backendPort}`;
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

function normalizeHeaders(headers: HeadersInit | undefined) {
  const normalized: Record<string, string> = {};
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalized[key.toLowerCase()] = value;
    });
  } else if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      normalized[key.toLowerCase()] = value;
    }
  } else if (headers) {
    for (const key of Object.keys(headers)) {
      const value = headers[key as keyof typeof headers];
      if (typeof value === "string") {
        normalized[key.toLowerCase()] = value;
      }
    }
  }
  return normalized;
}

function buildApiUrl(input: RequestInfo) {
  const apiBaseUrl = getResolvedAdminApiBaseUrl();
  if (typeof input !== "string" || !apiBaseUrl) return input;
  return new URL(input, apiBaseUrl).toString();
}

function formatNetworkError(input: RequestInfo, error: unknown) {
  const target = typeof input === "string" ? input : "request";
  const detail = error instanceof Error && error.message ? error.message : "Network request failed";
  if (import.meta.env.DEV) {
    return new Error(`Unable to reach the backend for ${target}. Make sure Shravan_Backend is running on http://localhost:8082. (${detail})`);
  }
  return new Error(`Unable to reach the backend for ${target}. Please try again.`);
}

function parseResponseData(text: string, contentType: string) {
  if (!text) return null;
  if (contentType.includes("application/json")) {
    return JSON.parse(text);
  }

  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return text;
    }
  }

  return text;
}

function absolutizeApiAsset(value: string) {
  if (!value.startsWith("/api/")) return value;
  const apiBaseUrl = getResolvedAdminApiBaseUrl();
  if (!apiBaseUrl) return value;
  return new URL(value, apiBaseUrl).toString();
}

function normalizeApiPayload<T>(value: T): T {
  if (typeof value === "string") {
    return absolutizeApiAsset(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeApiPayload(entry)) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const normalized: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    normalized[key] = normalizeApiPayload(entry);
  }
  return normalized as T;
}

export async function apiFetch<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = normalizeHeaders(init?.headers);
  const requestInput = buildApiUrl(input);

  if (!headers["content-type"] && init?.body != null) {
    headers["content-type"] = "application/json";
  }

  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(requestInput, {
      ...init,
      headers,
    });
  } catch (error) {
    throw formatNetworkError(input, error);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  const data = parseResponseData(text, contentType);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }
    const message = typeof data === "object" && data && "message" in data ? String((data as { message?: unknown }).message) : null;
    throw new Error(message || text.slice(0, 200) || response.statusText || "Request failed");
  }

  if (contentType && !contentType.includes("application/json") && typeof data === "string") {
    throw new Error(data.slice(0, 200));
  }

  return normalizeApiPayload(data as T);
}
