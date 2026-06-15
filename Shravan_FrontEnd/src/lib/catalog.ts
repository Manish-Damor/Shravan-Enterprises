import { categories as fallbackCategories, type Category as FallbackCategory } from "@/lib/products-data";
import type { QueryClient } from "@tanstack/react-query";

export type PublicCategory = {
  id: string | null;
  slug: string;
  title: string;
  tagline: string;
  image: string;
  items: string[];
  status?: string;
  sort_order?: number;
};

export type PublicProduct = {
  id: string | null;
  slug: string;
  name: string;
  subtitle: string | null;
  characteristics?: string | null;
  category_id: string | null;
  category_slug: string | null;
  category_title: string | null;
  featured: boolean;
  image: string | null;
  gallery_images?: string[];
  files?: Array<{
    key: string;
    url: string;
    name: string;
    type: string | null;
  }>;
  applications?: string[];
  application_rows?: unknown[];
  industries?: string[];
  tags?: string[];
  short_description: string | null;
  detailed_description: string | null;
  key_features?: string | null;
  unit_of_measurement?: string | null;
  moq?: string | null;
  available_packing_size?: string | null;
  technical_specifications?: unknown;
  specification_rows?: unknown[];
  createdAt: string | null;
  updatedAt: string | null;
};

export type PublicCatalog = {
  categories: PublicCategory[];
  products: PublicProduct[];
  counts: {
    categories: number;
    products: number;
    enquiries: number;
  };
};

export type PublicEnquiryInput = {
  customer_name: string;
  company?: string;
  mobile: string;
  email?: string;
  subject?: string;
  message: string;
  product_id?: string | null;
  category_id?: string | null;
};

export type BrochureEnquiryInput = {
  name: string;
  email: string;
};

const LOCAL_API_PORT_CANDIDATES = ["8082", "8083"] as const;
const IIS_BACKEND_PORT = "8083";
const DEV_FRONTEND_PORTS = new Set(["8094", "8095"]);

const fallbackBySlug = new Map(fallbackCategories.map((category) => [category.slug, category]));

function toAbsoluteApiUrl(path: string) {
  const apiBaseUrl = getConfiguredApiBaseUrl();
  if (!apiBaseUrl) return null;
  return new URL(path, apiBaseUrl).toString();
}

function getWindowDerivedApiBaseUrl() {
  if (typeof window === "undefined") return "";

  const { protocol, hostname, port } = window.location;
  if (!hostname) return "";

  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname);
  if (isLocalHost) {
    const backendPort = DEV_FRONTEND_PORTS.has(port) ? "8082" : IIS_BACKEND_PORT;
    return `${protocol}//${hostname}:${backendPort}`;
  }

  return `${protocol}//${hostname}:${IIS_BACKEND_PORT}`;
}

function readProcessEnv(name: string) {
  try {
    if (typeof process !== "undefined" && process.env && typeof process.env[name] === "string") {
      return process.env[name]?.trim() ?? "";
    }
  } catch {}

  return "";
}

function getConfiguredApiBaseUrl() {
  const configured =
    import.meta.env.VITE_API_URL?.trim() ??
    import.meta.env.VITE_PUBLIC_API_BASE_URL?.trim() ??
    readProcessEnv("VITE_API_URL") ??
    readProcessEnv("VITE_PUBLIC_API_BASE_URL") ??
    readProcessEnv("API_URL") ??
    readProcessEnv("PUBLIC_API_URL") ??
    "";

  if (configured) return configured;

  const derived = getWindowDerivedApiBaseUrl();
  if (derived) return derived;

  // During SSR in local development, there is no browser origin or Vite proxy.
  if (import.meta.env.DEV) {
    return "http://localhost:8082";
  }

  return "";
}

function appendUniqueUrl(urls: string[], value: string | null) {
  if (!value || urls.includes(value)) return;
  urls.push(value);
}

function getBrowserApiCandidates(path: string) {
  if (typeof window === "undefined") return [];

  const urls: string[] = [];
  appendUniqueUrl(urls, new URL(path, window.location.origin).toString());

  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  if (!isLocalHost) return urls;

  for (const port of LOCAL_API_PORT_CANDIDATES) {
    appendUniqueUrl(urls, new URL(path, `${window.location.protocol}//${window.location.hostname}:${port}`).toString());
  }

  return urls;
}

function getApiRequestUrls(path: string) {
  const urls: string[] = [];
  appendUniqueUrl(urls, toAbsoluteApiUrl(path));

  for (const candidate of getBrowserApiCandidates(path)) {
    appendUniqueUrl(urls, candidate);
  }

  return urls;
}

function fallbackCategoryImage(slug: string) {
  return fallbackBySlug.get(slug)?.image ?? "";
}

function readMediaUrl(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return toAbsoluteApiUrl(trimmed) ?? trimmed;
  }

  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const url = typeof record.url === "string" ? record.url.trim() : "";
  if (url) return toAbsoluteApiUrl(url) ?? url;
  const fallback = typeof record.value === "string" ? record.value.trim() : "";
  if (!fallback) return null;
  return toAbsoluteApiUrl(fallback) ?? fallback;
}

function fallbackCatalog(): PublicCatalog {
  return {
    categories: fallbackCategories.map((category) => ({
      id: null,
      slug: category.slug,
      title: category.title,
      tagline: category.tagline,
      image: category.image,
      items: [...category.items],
      status: "active",
      sort_order: 0,
    })),
    products: [],
    counts: {
      categories: fallbackCategories.length,
      products: 0,
      enquiries: 0,
    },
  };
}

function normalizeCategory(value: unknown): PublicCategory | null {
  if (!value || typeof value !== "object") return null;
  const category = value as Record<string, unknown>;
  const title = String(category.title ?? category.name ?? "").trim();
  const slug = String(category.slug ?? "").trim();
  if (!title || !slug) return null;

  const fallback = fallbackBySlug.get(slug);
  const items = Array.isArray(category.items)
    ? category.items.map((item) => String(item).trim()).filter(Boolean)
    : fallback
      ? [...fallback.items]
      : [];

  return {
    id: category.id ? String(category.id) : null,
    slug,
    title,
    tagline: String(category.tagline ?? category.short_description ?? category.description ?? fallback?.tagline ?? "").trim(),
    image: String(category.image ?? fallbackCategoryImage(slug) ?? ""),
    items,
    status: typeof category.status === "string" ? category.status : "active",
    sort_order: typeof category.sort_order === "number" ? category.sort_order : 0,
  };
}

function normalizeProduct(value: unknown): PublicProduct | null {
  if (!value || typeof value !== "object") return null;
  const product = value as Record<string, unknown>;
  const name = String(product.name ?? product.title ?? "").trim();
  const slug = String(product.slug ?? "").trim();
  if (!name || !slug) return null;

  return {
    id: product.id ? String(product.id) : null,
    slug,
    name,
    subtitle: product.subtitle ? String(product.subtitle) : null,
    characteristics: product.characteristics ? String(product.characteristics) : null,
    category_id: product.category_id ? String(product.category_id) : null,
    category_slug: product.category_slug ? String(product.category_slug) : null,
    category_title: product.category_title ? String(product.category_title) : null,
    featured: Boolean(product.featured),
    image: readMediaUrl(product.image) ?? (product.image ? String(product.image) : null),
    gallery_images: Array.isArray(product.gallery_images)
      ? product.gallery_images
          .map((item) => readMediaUrl(item) ?? (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
      : [],
    files: Array.isArray(product.files)
      ? product.files
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const file = item as Record<string, unknown>;
            const key = String(file.key ?? "").trim();
            const rawUrl = String(file.url ?? file.value ?? "").trim();
            const url = toAbsoluteApiUrl(rawUrl) ?? rawUrl;
            if (!key || !url) return null;
            return {
              key,
              url,
              name: String(file.name ?? file.filename ?? key).trim(),
              type: file.type ? String(file.type) : null,
            };
          })
          .filter((item): item is NonNullable<PublicProduct["files"]>[number] => item !== null)
      : [],
    applications: Array.isArray(product.applications)
      ? product.applications.map((item) => String(item).trim()).filter(Boolean)
      : [],
    application_rows: Array.isArray(product.application_rows) ? product.application_rows : [],
    industries: Array.isArray(product.industries)
      ? product.industries.map((item) => String(item).trim()).filter(Boolean)
      : [],
    tags: Array.isArray(product.tags)
      ? product.tags.map((item) => String(item).trim()).filter(Boolean)
      : [],
    short_description: product.short_description ? String(product.short_description) : null,
    detailed_description: product.detailed_description ? String(product.detailed_description) : null,
    key_features: product.key_features ? String(product.key_features) : null,
    unit_of_measurement: product.unit_of_measurement ? String(product.unit_of_measurement) : null,
    moq: product.moq ? String(product.moq) : null,
    available_packing_size: product.available_packing_size ? String(product.available_packing_size) : null,
    technical_specifications: product.technical_specifications ?? null,
    specification_rows: Array.isArray(product.specification_rows) ? product.specification_rows : [],
    createdAt: product.createdAt ? String(product.createdAt) : null,
    updatedAt: product.updatedAt ? String(product.updatedAt) : null,
  };
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const urls = getApiRequestUrls(path);
  if (urls.length === 0) {
    throw new Error("Set VITE_PUBLIC_API_BASE_URL to connect the public website to the backend.");
  }

  const headers: Record<string, string> = {};
  if (init?.body != null) {
    headers["content-type"] = "application/json";
  }

  let lastError: Error | null = null;

  for (const url of urls) {
    let response: Response;

    try {
      response = await fetch(url, {
        ...init,
        headers: {
          ...headers,
          ...(init?.headers as Record<string, string> | undefined),
        },
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Request failed");
      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();

    if (!contentType.includes("application/json")) {
      const bodyPreview = text?.slice(0, 200) ?? "";
      lastError = new Error(
        text
          ? `Expected JSON response but received: ${bodyPreview}`
          : response.statusText || "Request failed",
      );
      continue;
    }

    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const err = new Error(payload?.message || response.statusText || "Request failed");
      try {
        (err as any).payload = payload;
      } catch {}
      throw err;
    }

    return payload as T;
  }

  throw lastError ?? new Error("Request failed");
}

export async function fetchPublicCatalog(): Promise<PublicCatalog> {
  try {
    const payload = await requestJson<{
      categories?: unknown[];
      products?: unknown[];
      counts?: Partial<PublicCatalog["counts"]>;
    }>("/api/public/catalog");

    const categories = (payload.categories ?? []).map(normalizeCategory).filter((item): item is PublicCategory => item !== null);
    const products = (payload.products ?? []).map(normalizeProduct).filter((item): item is PublicProduct => item !== null);

    if (categories.length === 0) {
      return fallbackCatalog();
    }

    return {
      categories,
      products,
      counts: {
        categories: payload.counts?.categories ?? categories.length,
        products: payload.counts?.products ?? products.length,
        enquiries: payload.counts?.enquiries ?? 0,
      },
    };
  } catch {
    return fallbackCatalog();
  }
}

export async function fetchPublicProductBySlug(slug: string) {
  try {
    const payload = await requestJson<{ products?: unknown[] }>("/api/public/catalog");
    const products = payload.products ?? [];
    const found = (products as Record<string, unknown>[]).find(
      (product) => String(product.slug ?? "").trim() === String(slug ?? "").trim(),
    );
    return found ?? null;
  } catch {
    return null;
  }
}

export function getPublicCatalogQueryOptions() {
  return {
    queryKey: ["public-catalog"] as const,
    queryFn: fetchPublicCatalog,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true as const,
    refetchOnWindowFocus: true as const,
  };
}

export async function preloadPublicCatalog(queryClient: QueryClient) {
  await queryClient.ensureQueryData(getPublicCatalogQueryOptions());
}

export async function submitPublicEnquiry(input: PublicEnquiryInput) {
  return requestJson<{ success: boolean; id: string }>("/api/public/enquiries", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function submitBrochureEnquiry(input: BrochureEnquiryInput) {
  return requestJson<{ success: boolean; message?: string; id: string }>("/api/brochure-enquiries", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getFallbackCatalog() {
  return fallbackCatalog();
}

export function asFallbackPublicCategories() {
  return fallbackCatalog().categories;
}
