const AUTH_TOKEN_KEY = "wwk_auth_token";

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

export async function apiFetch<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = normalizeHeaders(init?.headers);

  if (!headers["content-type"] && init?.body != null) {
    headers["content-type"] = "application/json";
  }

  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    const bodyPreview = text?.slice(0, 200) ?? "";
    const errMsg = text ? `Expected JSON response but received: ${bodyPreview}` : response.statusText || "Request failed";
    if (response.status === 401) {
      clearAuthToken();
    }
    throw new Error(errMsg);
  }

  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }
    throw new Error(data?.message || response.statusText || "Request failed");
  }

  return data as T;
}
