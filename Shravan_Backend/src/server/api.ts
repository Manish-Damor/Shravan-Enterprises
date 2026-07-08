import { ObjectId } from "mongodb";
import { writeFile, mkdir, access, readFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { getMongoCollections } from "@/integrations/mongo/client.server";
import { hashPassword, comparePassword, createAuthToken, verifyAuthToken } from "@/integrations/mongo/auth";
import { sendEnquiryNotificationEmail } from "@/lib/mail";

const appRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function errorResponse(message: string, status = 400, errors?: Record<string, string>) {
  const payload: Record<string, unknown> = { message };
  if (errors && Object.keys(errors).length > 0) payload.errors = errors;
  return jsonResponse(payload, status);
}

type CollectionName =
  | "categories"
  | "products"
  | "enquiries"
  | "brochure_enquiries"
  | "website_settings"
  | "banners"
  | "clients"
  | "generated_pdfs";

function routeBaseForCollection(collectionName: CollectionName) {
  if (collectionName === "website_settings") return "website-settings";
  if (collectionName === "generated_pdfs") return "generated-pdfs";
  if (collectionName === "brochure_enquiries") return "brochure-enquiries";
  return collectionName;
}

function serializeDocument<T extends Record<string, unknown>>(document: T & { _id?: ObjectId }) {
  const { _id, ...rest } = document;
  return { id: _id?.toString(), ...rest };
}

function parseBool(value: string | null) {
  if (value === null) return undefined;
  return value === "true" || value === "1";
}

function isPrivilegedRole(role: unknown) {
  return ["admin", "super_admin", "product_manager", "content_manager", "sales_manager"].includes(String(role ?? ""));
}

function buildQuery(collectionName: CollectionName, url: URL) {
  const query: Record<string, unknown> = {};

  if (collectionName === "enquiries") {
    const status = url.searchParams.get("status");
    if (status && status !== "all") query.status = status;
  }

  if (collectionName === "categories") {
    const visible = parseBool(url.searchParams.get("visible"));
    if (visible !== undefined) {
      query.status = visible ? { $ne: "inactive" } : "inactive";
    }
    const parentId = url.searchParams.get("parent_id");
    if (parentId) query.parent_id = parentId;
  }

  if (collectionName === "products") {
    const status = url.searchParams.get("status");
    if (status && status !== "all") query.status = status;
    const featured = parseBool(url.searchParams.get("featured"));
    if (featured !== undefined) query.featured = featured;
    const categoryId = url.searchParams.get("category_id");
    if (categoryId && categoryId !== "all") query.category_id = categoryId;
    const published = parseBool(url.searchParams.get("published"));
    if (published !== undefined) query.status = published ? "published" : "draft";
  }

  return query;
}

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

async function requireUser(request: Request) {
  const token = getBearerToken(request);
  if (!token) throw new Error("Unauthorized");

  const payload = await verifyAuthToken(token);
  if (!payload || typeof payload.sub !== "string") throw new Error("Unauthorized");

  const { users } = await getMongoCollections();
  const user = await users.findOne({ _id: new ObjectId(payload.sub) });
  if (!user) throw new Error("Unauthorized");
  return user;
}

async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (!isPrivilegedRole(user.role)) throw new Error("Forbidden");
  return user;
}

function normalizeIdentifier(value: string) {
  const trimmed = value.trim();
  const phone = trimmed.replace(/[^0-9+]/g, "");
  if (/^\+?[0-9]{6,}$/.test(phone)) {
    return { phone };
  }
  return { email: trimmed.toLowerCase() };
}

function slugifyText(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractMediaUrl(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("/") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
      return trimmed;
    }
    return null;
  }
  if (!value || typeof value !== "object") return null;
  const media = value as Record<string, unknown>;
  const url = media.url ?? media.value;
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("/") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }
  return null;
}

function pickFirstMediaUrl(...values: unknown[]) {
  for (const value of values) {
    const url = extractMediaUrl(value);
    if (url) return url;
  }

  return null;
}

function extractString(value: unknown) {
  if (typeof value === "string") return value.trim();
  return "";
}

function extractStringArray(value: unknown) {
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(value)) return [] as string[];
  return value.map((item) => {
    if (typeof item === "string") return item.trim();
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const label =
        record.label ??
        record.name ??
        record.title ??
        record.value ??
        record.url ??
        record.property;
      return typeof label === "string" ? label.trim() : "";
    }
    return "";
  }).filter(Boolean);
}

function extractText(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value
      .map((item) => extractString(item))
      .filter(Boolean)
      .join(", ");
  }

  return null;
}

function extractMediaList(value: unknown) {
  if (!Array.isArray(value)) return [] as Array<{ url: string; name?: string | null; type?: string | null }>;
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const media = item as Record<string, unknown>;
      const url = typeof media.url === "string" ? media.url.trim() : "";
      if (!url) return null;
      return {
        url,
        name: typeof media.name === "string" ? media.name : typeof media.filename === "string" ? media.filename : null,
        type: typeof media.type === "string" ? media.type : typeof media.mimeType === "string" ? media.mimeType : null,
      };
    })
    .filter((item): item is { url: string; name?: string | null; type?: string | null } => item !== null);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function firstNonEmptyString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
      continue;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }

    if (value instanceof ObjectId) {
      return value.toString();
    }

    if (isRecord(value)) {
      if (typeof value.$oid === "string" && value.$oid.trim()) return value.$oid.trim();
      if (typeof value.id === "string" && value.id.trim()) return value.id.trim();
      if (typeof value._id === "string" && value._id.trim()) return value._id.trim();
      if (value._id instanceof ObjectId) return value._id.toString();
      const maybeHex = value as { toHexString?: () => string };
      if (typeof maybeHex.toHexString === "function") {
        const hex = maybeHex.toHexString();
        if (hex.trim()) return hex.trim();
      }
    }
  }

  return null;
}

function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function inferMediaType(url: string, explicitType: unknown, kind: "image" | "file") {
  const explicit = firstNonEmptyString(explicitType);
  if (explicit) return explicit;

  const dataUrlMatch = url.match(/^data:([^;,]+)[;,]/i);
  if (dataUrlMatch?.[1]) return dataUrlMatch[1];

  const lower = url.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".avif")) return "image/avif";
  if (lower.endsWith(".pdf")) return "application/pdf";

  return kind === "image" ? "image/*" : "application/octet-stream";
}

function mediaNameFromUrl(url: string, fallback: string) {
  try {
    const pathname = new URL(url, "http://local.invalid").pathname;
    const name = pathname.split("/").pop()?.trim();
    return name || fallback;
  } catch {
    return fallback;
  }
}

function normalizeMediaValue(value: unknown, kind: "image" | "file") {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return {
      name: mediaNameFromUrl(trimmed, kind === "image" ? "image" : "file"),
      url: trimmed,
      type: inferMediaType(trimmed, null, kind),
    };
  }

  if (!isRecord(value)) return null;

  const url =
    firstNonEmptyString(value.url, value.value, value.src, value.path) ??
    (typeof value.dataBase64 === "string" && value.dataBase64.trim()
      ? `data:${inferMediaType("", value.type ?? value.mimeType ?? value.contentType, kind)};base64,${value.dataBase64.trim()}`
      : null);
  if (!url) return null;

  const type = inferMediaType(url, value.type ?? value.mimeType ?? value.contentType, kind);
  return {
    name:
      firstNonEmptyString(value.name, value.filename, value.originalFilename, value.title) ??
      mediaNameFromUrl(url, kind === "image" ? "image" : "file"),
    url,
    type,
  };
}

function normalizeMediaArray(value: unknown, kind: "image" | "file") {
  if (!Array.isArray(value)) return [] as Array<{ name: string; url: string; type: string }>;
  return value
    .map((item) => normalizeMediaValue(item, kind))
    .filter((item): item is { name: string; url: string; type: string } => item !== null);
}

function mergeUniqueMedia(
  items: Array<{ name: string; url: string; type: string } | null | undefined>,
) {
  const seen = new Set<string>();
  const merged: Array<{ name: string; url: string; type: string }> = [];

  for (const item of items) {
    if (!item?.url) continue;
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    merged.push(item);
  }

  return merged;
}

function normalizeFileEntries(value: unknown) {
  if (!Array.isArray(value)) return [] as Array<{ key: string; name: string; url: string; type: string }>;
  return value
    .map((item, index) => {
      const media = normalizeMediaValue(item, "file");
      if (!media) return null;
      const key = isRecord(item)
        ? firstNonEmptyString(item.key, item.kind, item.label, item.name)
        : null;
      return {
        key: key ?? `file_${index + 1}`,
        ...media,
      };
    })
    .filter((item): item is { key: string; name: string; url: string; type: string } => item !== null);
}

function normalizeRepeatableRows(value: unknown, fallbackKey = "value") {
  if (!Array.isArray(value)) return [] as Array<Record<string, string>>;
  return value
    .map((item) => {
      if (typeof item === "string") {
        const trimmed = item.trim();
        return trimmed ? { [fallbackKey]: trimmed } : null;
      }

      if (!isRecord(item)) return null;

      const row: Record<string, string> = {};
      for (const [key, fieldValue] of Object.entries(item)) {
        if (typeof fieldValue === "string") {
          row[key] = fieldValue;
          continue;
        }

        if (typeof fieldValue === "number" && Number.isFinite(fieldValue)) {
          row[key] = String(fieldValue);
          continue;
        }

        const nested = firstNonEmptyString(fieldValue);
        if (nested) row[key] = nested;
      }

      return Object.keys(row).length > 0 ? row : null;
    })
    .filter((item): item is Record<string, string> => item !== null);
}

function normalizeCategoryStatus(value: unknown, visible?: unknown) {
  const status = firstNonEmptyString(value)?.toLowerCase();
  if (status === "inactive" || status === "hidden" || status === "draft") return "inactive";
  if (status === "active" || status === "published" || status === "visible" || status === "live") return "active";

  if (typeof visible === "boolean") return visible ? "active" : "inactive";
  if (typeof visible === "string") {
    const parsed = parseBool(visible);
    if (parsed !== undefined) return parsed ? "active" : "inactive";
  }

  return "active";
}

function normalizeProductStatus(value: unknown) {
  const status = firstNonEmptyString(value)?.toLowerCase();
  if (status === "draft" || status === "inactive" || status === "hidden") return "draft";
  if (status === "published" || status === "active" || status === "live" || status === "visible") return "published";
  return "published";
}

type CategoryLookup = {
  byId: Map<string, Record<string, unknown>>;
  bySlug: Map<string, Record<string, unknown>>;
  byName: Map<string, Record<string, unknown>>;
};

function normalizeCategoryDocument(document: Record<string, unknown> & { _id?: ObjectId }) {
  const name = firstNonEmptyString(document.name, document.title) ?? "Untitled Category";
  const shortDescription =
    firstNonEmptyString(
      document.short_description,
      document.shortDescription,
      document.tagline,
      document.description,
      document.longDescription,
    ) ?? null;
  const description =
    firstNonEmptyString(
      document.description,
      document.long_description,
      document.longDescription,
      document.short_description,
      document.shortDescription,
      document.tagline,
    ) ?? shortDescription;

  return {
    ...(document._id ? { _id: document._id } : {}),
    name,
    slug: firstNonEmptyString(document.slug) ?? slugifyText(name),
    short_description: shortDescription,
    description,
    banner_image: normalizeMediaValue(
      document.banner_image ??
        document.bannerImage ??
        document.image ??
        document.banner ??
        document.categoryBannerImage,
      "image",
    ),
    icon: normalizeMediaValue(document.icon ?? document.icon_image ?? document.thumbnail, "image"),
    seo_title: firstNonEmptyString(document.seo_title, document.seoTitle, document.meta_title) ?? null,
    seo_description:
      firstNonEmptyString(document.seo_description, document.seoDescription, document.meta_description) ?? null,
    status: normalizeCategoryStatus(document.status, document.is_visible),
    sort_order: normalizeNumber(document.sort_order ?? document.sortOrder ?? document.position, 0),
    parent_id: firstNonEmptyString(document.parent_id, document.parentId, document.parent, document.parentRef) ?? null,
    createdAt: firstNonEmptyString(document.createdAt, document.created_at) ?? null,
    updatedAt: firstNonEmptyString(document.updatedAt, document.updated_at) ?? null,
  };
}

function buildCategoryLookups(categoryDocs: Array<Record<string, unknown> & { _id?: ObjectId }>): CategoryLookup {
  const byId = new Map<string, Record<string, unknown>>();
  const bySlug = new Map<string, Record<string, unknown>>();
  const byName = new Map<string, Record<string, unknown>>();

  for (const rawCategory of categoryDocs) {
    const normalized = normalizeCategoryDocument(rawCategory);
    const hydrated = { ...rawCategory, ...normalized };
    const id = rawCategory._id?.toString?.() ?? firstNonEmptyString(rawCategory.id);
    if (id) byId.set(id, hydrated);
    if (normalized.slug) bySlug.set(normalized.slug.toLowerCase(), hydrated);
    if (normalized.name) byName.set(normalized.name.toLowerCase(), hydrated);
  }

  return { byId, bySlug, byName };
}

function resolveCategoryReference(
  document: Record<string, unknown>,
  lookups?: CategoryLookup,
) {
  const idCandidates = [
    document.category_id,
    document.categoryId,
    document.categoryRef,
    document.categoryIdString,
    document.category_id_string,
  ];

  for (const candidate of idCandidates) {
    const value = firstNonEmptyString(candidate);
    if (!value) continue;
    const direct = lookups?.byId.get(value) ?? lookups?.bySlug.get(value.toLowerCase()) ?? lookups?.byName.get(value.toLowerCase());
    if (direct) {
      return {
        id: firstNonEmptyString(direct._id, direct.id, value),
        category: direct,
      };
    }
  }

  const slugCandidates = [
    document.category_slug,
    document.categorySlug,
    document.category,
    document.category_handle,
  ];

  for (const candidate of slugCandidates) {
    const value = firstNonEmptyString(candidate);
    if (!value) continue;
    const direct = lookups?.bySlug.get(value.toLowerCase());
    if (direct) {
      return {
        id: firstNonEmptyString(direct._id, direct.id),
        category: direct,
      };
    }
  }

  const nameCandidates = [
    document.category_title,
    document.categoryTitle,
    document.categoryName,
    document.category_name,
  ];

  for (const candidate of nameCandidates) {
    const value = firstNonEmptyString(candidate);
    if (!value) continue;
    const direct = lookups?.byName.get(value.toLowerCase());
    if (direct) {
      return {
        id: firstNonEmptyString(direct._id, direct.id),
        category: direct,
      };
    }
  }

  return {
    id: firstNonEmptyString(...idCandidates) ?? null,
    category: null,
  };
}

function normalizeProductDocument(
  document: Record<string, unknown> & { _id?: ObjectId },
  categoryLookups?: CategoryLookup,
) {
  const name = firstNonEmptyString(document.name, document.title, document.product_name) ?? "Untitled Product";
  const categoryRef = resolveCategoryReference(document, categoryLookups);
  const primaryImage = normalizeMediaValue(
    document.image ??
      document.primary_image ??
      document.primaryImage ??
      document.mainImage ??
      document.mainProductImage ??
      document.imageUrl ??
      document.og_image ??
      (Array.isArray(document.gallery_images) ? document.gallery_images[0] : null) ??
      (Array.isArray(document.images) ? document.images[0] : null),
    "image",
  );
  const galleryImages = mergeUniqueMedia([
    primaryImage,
    ...normalizeMediaArray(document.gallery_images ?? document.images, "image"),
  ]);
  const applicationRows = normalizeRepeatableRows(
    document.application_rows ?? document.applicationRows,
    "title",
  );
  const specificationRows = normalizeRepeatableRows(
    document.specification_rows ?? document.technicalRows,
    "property",
  );
  const applicationsSummary =
    extractText(document.applications) ??
    extractText(document.application) ??
    (applicationRows.length > 0
      ? applicationRows
          .map((row) => row.title ?? row.name ?? row.application_title ?? row.value ?? "")
          .filter(Boolean)
          .join(", ")
      : null);

  return {
    ...(document._id ? { _id: document._id } : {}),
    name,
    slug: firstNonEmptyString(document.slug, document.handle) ?? slugifyText(name),
    category_id: categoryRef.id,
    subtitle: firstNonEmptyString(document.subtitle, document.tagline, document.short_line) ?? null,
    short_description:
      firstNonEmptyString(
        document.short_description,
        document.shortDescription,
        document.shortLine,
        document.summary,
      ) ?? null,
    detailed_description:
      firstNonEmptyString(
        document.detailed_description,
        document.detailedDescription,
        document.product_details,
        document.description,
      ) ?? null,
    status: normalizeProductStatus(document.status),
    featured: Boolean(document.featured),
    sort_order: normalizeNumber(document.sort_order ?? document.sortOrder ?? document.position, 0),
    image: primaryImage,
    gallery_images: galleryImages,
    application_images: normalizeMediaArray(
      document.application_images ?? document.applicationImages,
      "image",
    ),
    files: normalizeFileEntries(document.files),
    brochure_pdf: normalizeMediaValue(document.brochure_pdf ?? document.brochurePdf, "file"),
    tds_pdf: normalizeMediaValue(document.tds_pdf ?? document.tdsPdf, "file"),
    msds_pdf: normalizeMediaValue(document.msds_pdf ?? document.msdsPdf, "file"),
    certificate: normalizeMediaValue(document.certificate, "file"),
    applications: applicationsSummary,
    application_rows: applicationRows,
    key_features: extractText(document.key_features ?? document.keyFeatures) ?? null,
    characteristics: extractText(document.characteristics) ?? null,
    technical_specifications:
      firstNonEmptyString(document.technical_specifications, document.technicalSummary) ?? null,
    specification_rows: specificationRows,
    industries_served:
      extractText(document.industries_served) ??
      extractText(document.industriesServed) ??
      extractText(document.industries) ??
      null,
    unit_of_measurement:
      firstNonEmptyString(document.unit_of_measurement, document.unit, document.uom) ?? null,
    moq: firstNonEmptyString(document.moq) ?? null,
    available_packing_size:
      firstNonEmptyString(document.available_packing_size, document.packingSize) ?? null,
    tags: extractStringArray(document.tags),
    createdAt: firstNonEmptyString(document.createdAt, document.created_at) ?? null,
    updatedAt: firstNonEmptyString(document.updatedAt, document.updated_at) ?? null,
  };
}

async function normalizeManagedCollectionDocument(
  collections: Awaited<ReturnType<typeof getMongoCollections>>,
  collectionName: CollectionName,
  document: Record<string, unknown> & { _id?: ObjectId },
  categoryLookups?: CategoryLookup,
) {
  if (collectionName === "categories") {
    return normalizeCategoryDocument(document);
  }

  if (collectionName === "products") {
    if (categoryLookups) {
      return normalizeProductDocument(document, categoryLookups);
    }

    const categoryDocs = await collections.categories.find({}).toArray();
    return normalizeProductDocument(document, buildCategoryLookups(categoryDocs));
  }

  return document;
}

async function handlePublicRoutes(request: Request, pathname: string) {
  const { categories, products, enquiries, brochure_enquiries } = await getMongoCollections();
  const url = new URL(request.url);

  if (pathname === "/api/public/catalog" && request.method === "GET") {
    const [categoryDocs, productDocs] = await Promise.all([
      categories.find({}).sort({ sort_order: 1, createdAt: -1 }).toArray(),
      products.find({}).sort({ sort_order: 1, createdAt: -1 }).toArray(),
    ]);
    const categoryLookups = buildCategoryLookups(categoryDocs);
    const normalizedCategories = categoryDocs
      .map((category) => normalizeCategoryDocument(category))
      .filter((category) => category.status !== "inactive");
    const normalizedProducts = productDocs
      .map((product) => normalizeProductDocument(product, categoryLookups))
      .filter((product) => product.status === "published");

    const categoryById = new Map<string, Record<string, unknown>>();
    for (const category of categoryDocs) {
      if (category._id) categoryById.set(category._id.toString(), category);
    }

    const productsByCategoryId = new Map<string, Array<Record<string, unknown>>>();
    for (const product of normalizedProducts) {
      const categoryId = firstNonEmptyString(product.category_id);
      if (!categoryId) continue;
      const bucket = productsByCategoryId.get(categoryId) ?? [];
      bucket.push(product);
      productsByCategoryId.set(categoryId, bucket);
    }

    const publicCategories = normalizedCategories.map((category) => {
      const categoryId = category._id?.toString?.() ?? null;
      const relatedProducts = categoryId ? productsByCategoryId.get(categoryId) ?? [] : [];

      return {
        id: categoryId,
        slug: category.slug,
        title: category.name,
        tagline: category.short_description ?? category.description ?? "",
        image: category.banner_image?.url ?? category.icon?.url ?? "",
        items: relatedProducts
          .map((product) => firstNonEmptyString(product.name))
          .filter((item): item is string => Boolean(item)),
        status: category.status,
        sort_order: category.sort_order,
      };
    });

    const publicProducts = normalizedProducts.map((product) => {
      const category =
        firstNonEmptyString(product.category_id)
          ? categoryById.get(String(product.category_id))
          : null;
      const normalizedCategory = category ? normalizeCategoryDocument(category as Record<string, unknown> & { _id?: ObjectId }) : null;
      const directFiles = normalizeFileEntries(product.files);
      const derivedFiles = [
        product.brochure_pdf
          ? { key: "brochure_pdf", ...product.brochure_pdf }
          : null,
        product.tds_pdf ? { key: "tds_pdf", ...product.tds_pdf } : null,
        product.msds_pdf ? { key: "msds_pdf", ...product.msds_pdf } : null,
        product.certificate ? { key: "certificate", ...product.certificate } : null,
      ].filter((item): item is { key: string; name: string; url: string; type: string } => item !== null);
      const seenFiles = new Set<string>();
      const files = [...directFiles, ...derivedFiles].filter((file) => {
        const identity = `${file.key}:${file.url}`;
        if (seenFiles.has(identity)) return false;
        seenFiles.add(identity);
        return true;
      });

      return {
        id: product._id?.toString?.() ?? null,
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        category_id: product.category_id,
        category_slug:
          normalizedCategory?.slug ??
          firstNonEmptyString((product as Record<string, unknown>).category_slug, (product as Record<string, unknown>).categorySlug, (product as Record<string, unknown>).category) ??
          null,
        category_title:
          normalizedCategory?.name ??
          firstNonEmptyString((product as Record<string, unknown>).category_title, (product as Record<string, unknown>).categoryTitle, (product as Record<string, unknown>).categoryName) ??
          null,
        featured: Boolean(product.featured),
        image: product.image?.url ?? null,
        gallery_images: product.gallery_images ?? [],
        application_images: product.application_images ?? [],
        files,
        applications: extractStringArray(product.applications ?? product.application_rows),
        application_rows: product.application_rows ?? [],
        industries: extractStringArray(product.industries_served),
        tags: extractStringArray(product.tags),
        characteristics: product.characteristics ?? null,
        unit_of_measurement: product.unit_of_measurement ?? null,
        moq: product.moq ?? null,
        available_packing_size: product.available_packing_size ?? null,
        short_description: product.short_description ?? null,
        detailed_description: product.detailed_description ?? null,
        key_features: product.key_features ?? null,
        technical_specifications: product.technical_specifications ?? null,
        specification_rows: product.specification_rows ?? [],
        primary_image: product.image ?? null,
        createdAt: product.createdAt ?? null,
        updatedAt: product.updatedAt ?? null,
      };
    });

    return jsonResponse({
      categories: publicCategories,
      products: publicProducts,
      counts: {
        categories: publicCategories.length,
        products: publicProducts.length,
        enquiries: 0,
      },
    });
  }

  // Paginated public products endpoint with filtering and basic faceting
  if (pathname === "/api/public/products" && request.method === "GET") {
    const params = url.searchParams;
    const q = (params.get("q") || "").trim();
    const category = params.get("category") || params.get("category_id") || null;
    const featured = params.get("featured");
    const tag = params.get("tag");
    const page = Math.max(1, Number(params.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(params.get("limit") || 24)));
    const [categoryDocs, productDocs] = await Promise.all([
      categories.find({}).toArray(),
      products.find({}).toArray(),
    ]);
    const categoryLookups = buildCategoryLookups(categoryDocs);
    const requestedCategory = category
      ? categoryLookups.byId.get(category) ??
        categoryLookups.bySlug.get(category.toLowerCase()) ??
        categoryLookups.byName.get(category.toLowerCase()) ??
        null
      : null;
    const requestedCategoryId = requestedCategory
      ? firstNonEmptyString(requestedCategory._id, requestedCategory.id)
      : category;

    const normalizedProducts = productDocs
      .map((product) => normalizeProductDocument(product, categoryLookups))
      .filter((product) => product.status === "published");
    const featuredFilter = featured !== null ? parseBool(featured) : undefined;
    const normalizedQuery = q.toLowerCase();

    const filteredProducts = normalizedProducts.filter((product) => {
      if (requestedCategoryId && product.category_id !== requestedCategoryId) return false;
      if (featuredFilter !== undefined && Boolean(product.featured) !== featuredFilter) return false;
      if (tag && !(product.tags ?? []).includes(tag)) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        product.name,
        product.slug,
        product.short_description ?? "",
        product.detailed_description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    const sortedProducts = [...filteredProducts].sort((left, right) => {
      const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
      if (featuredDelta !== 0) return featuredDelta;

      const sortDelta = normalizeNumber(left.sort_order, 0) - normalizeNumber(right.sort_order, 0);
      if (sortDelta !== 0) return sortDelta;

      return String(right.createdAt ?? "").localeCompare(String(left.createdAt ?? ""));
    });

    const total = sortedProducts.length;
    const pagedProducts = sortedProducts.slice((page - 1) * limit, page * limit);
    const rows = pagedProducts.map((product) => ({
      id: product._id?.toString?.() ?? null,
      slug: product.slug,
      name: product.name,
      short_description: product.short_description ?? null,
      image: product.image?.url ?? null,
      featured: Boolean(product.featured),
      category_id: product.category_id ?? null,
      tags: extractStringArray(product.tags),
    }));
    const facetMap = new Map<string, number>();
    for (const product of filteredProducts) {
      const key = firstNonEmptyString(product.category_id) ?? "__null__";
      facetMap.set(key, (facetMap.get(key) ?? 0) + 1);
    }
    const facets = Array.from(facetMap.entries()).map(([categoryId, count]) => ({
      category_id: categoryId === "__null__" ? null : categoryId,
      count,
    }));

    return jsonResponse({
      total,
      page,
      limit,
      products: rows,
      facets: facets.map((f) => ({ category_id: f._id ?? null, count: f.count })),
    });
  }

  if (pathname === "/api/public/enquiries" && request.method === "POST") {
    const body = await request.json();
    const customerName = String(body.customer_name ?? body.name ?? "").trim();
    const mobile = String(body.mobile ?? body.phone ?? "").trim();
    const emailRaw = String(body.email ?? "").trim();
    const email = emailRaw ? emailRaw.toLowerCase() : null;
    const company = String(body.company ?? "").trim() || null;
    const subject = String(body.subject ?? body.product_name ?? "").trim() || null;
    const message = String(body.message ?? "").trim();

    const errors: Record<string, string> = {};
    if (!customerName) errors.customer_name = "Name is required.";
    else if (customerName.length < 2) errors.customer_name = "Name is too short.";

    if (!mobile) errors.mobile = "Mobile number is required.";
    else {
      const digits = mobile.replace(/[^0-9+]/g, "");
      if (!/^\+?[0-9]{6,}$/.test(digits)) errors.mobile = "Please enter a valid mobile number.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";

    if (!message) errors.message = "Message is required.";
    else if (message.length < 10) errors.message = "Message is too short (minimum 10 characters).";
    else if (message.length > 2000) errors.message = "Message is too long.";

    if (Object.keys(errors).length > 0) {
      return errorResponse("Validation failed", 400, errors);
    }

    const now = new Date().toISOString();
    const result = await enquiries.insertOne({
      customer_name: customerName,
      mobile,
      email,
      company,
      product_name: subject,
      product_id: body.product_id ?? null,
      category_id: body.category_id ?? null,
      message,
      status: "new",
      reply_note: null,
      createdAt: now,
      updatedAt: now,
    });

    try {
      const sent = await sendEnquiryNotificationEmail({
        customerName,
        company,
        mobile,
        email,
        subject,
        message,
        productId: body.product_id ?? null,
        categoryId: body.category_id ?? null,
      });
      if (!sent) {
        console.warn("Enquiry email notification skipped: mail transport is not configured.");
      }
    } catch (error) {
      console.error("Failed to send enquiry notification email", error);
    }

    return jsonResponse({ success: true, id: result.insertedId.toString() }, 201);
  }

  if (pathname === "/api/brochure-enquiry" && request.method === "POST") {
    const body = await request.json();
    const name = String(body.name ?? body.customer_name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!name) {
      return errorResponse("Name is required.");
    }

    if (!email) {
      return errorResponse("Email is required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse("Please enter a valid email address.");
    }

    const now = new Date().toISOString();
    const result = await brochure_enquiries.insertOne({
      name,
      email,
      createdAt: now,
      updatedAt: now,
    });

    return jsonResponse({ success: true, id: result.insertedId.toString() }, 201);
  }

  return errorResponse("Not found", 404);
}

async function handleBrochureEnquiryRequest(request: Request) {
  const { brochure_enquiries } = await getMongoCollections();
  const body = await request.json();
  const name = String(body.name ?? body.customer_name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!name || !email) {
    return jsonResponse({ success: false, message: "Name and email are required" }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ success: false, message: "Please enter a valid email address" }, 400);
  }

  const now = new Date().toISOString();
  const result = await brochure_enquiries.insertOne({
    name,
    email,
    createdAt: now,
    updatedAt: now,
  });

  return jsonResponse(
    {
      success: true,
      message: "Brochure request saved successfully",
      id: result.insertedId.toString(),
    },
    201,
  );
}

export async function handleApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "");

  try {
    if ((pathname === "/api/brochure-enquiry" || pathname === "/api/brochure-enquiries") && request.method === "POST") {
      return await handleBrochureEnquiryRequest(request);
    }

    if (pathname.startsWith("/api/public/")) {
      return await handlePublicRoutes(request, pathname);
    }

    if (pathname.startsWith("/api/auth")) {
      return await handleAuthRoutes(request, pathname);
    }

    if (pathname === "/api/users" && request.method === "GET") {
      const user = await requireAdmin(request);
      const { users } = await getMongoCollections();
      const list = await users
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
      return jsonResponse(list.map((item) => ({
        id: item._id.toString(),
        email: item.email,
        phone: item.phone,
        role: item.role,
        permissions: item.permissions ?? [],
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      })));
    }

    if (pathname.startsWith("/api/users/") && request.method === "PATCH") {
      await requireAdmin(request);
      const { users } = await getMongoCollections();
      const id = pathname.split("/").pop();
      if (!id) return errorResponse("Not found", 404);
      const body = await request.json();
      const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
      if (body.role) updates.role = String(body.role);
      if (body.permissions) updates.permissions = Array.isArray(body.permissions) ? body.permissions : [];
      const result = await users.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: "after" });
      if (!result) return errorResponse("User not found", 404);
      return jsonResponse({
        id: result._id.toString(),
        email: result.email,
        phone: result.phone,
        role: result.role,
        permissions: result.permissions ?? [],
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    }

    if (pathname.startsWith("/api/categories")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "categories");
    }

    if (pathname.startsWith("/api/products")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "products");
    }

    if (pathname.startsWith("/api/enquiries")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "enquiries");
    }

    if (pathname.startsWith("/api/brochure-enquiries")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "brochure_enquiries");
    }

    if (pathname === "/api/brochure-enquiry") {
      return errorResponse("Not found", 404);
    }

    if (pathname.startsWith("/api/website-settings")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "website_settings");
    }

    if (pathname.startsWith("/api/banners")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "banners");
    }

    if (pathname.startsWith("/api/clients")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "clients");
    }

    if (pathname.startsWith("/api/generated-pdfs")) {
      await requireAdmin(request);
      return await handleCollectionRoutes(request, pathname, "generated_pdfs");
    }

      // Upload routes (direct/base64 fallback for local dev)
      if (pathname.startsWith("/api/uploads")) {
        return await handleUploadRoutes(request, pathname);
      }

    return errorResponse("Not found", 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 400;
    return errorResponse(message, status);
  }
}

async function handleAuthRoutes(request: Request, pathname: string) {
  const { users } = await getMongoCollections();

  if (pathname === "/api/auth/register" && request.method === "POST") {
    const body = await request.json();
    const identifier = String(body.identifier ?? "").trim();
    const password = String(body.password ?? "");

    if (!identifier || password.length < 6) {
      return errorResponse("Identifier and password are required. Password must be at least 6 characters.");
    }

    const normalized = normalizeIdentifier(identifier);
    const query: Record<string, unknown> = {};
    if (normalized.email) query.email = normalized.email;
    if (normalized.phone) query.phone = normalized.phone;

    const existing = await users.findOne({ $or: [{ email: query.email ?? null }, { phone: query.phone ?? null }] });
    if (existing) {
      return errorResponse("An account with that identifier already exists.");
    }

    const adminCount = await users.countDocuments({ role: "admin" });
    const role = adminCount === 0 ? "admin" : "user";
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const result = await users.insertOne({
      email: normalized.email ?? null,
      phone: normalized.phone ?? null,
      passwordHash,
      role,
      createdAt: now,
      updatedAt: now,
    });

    const id = result.insertedId.toString();
    const token = await createAuthToken({ sub: id, role, email: normalized.email, phone: normalized.phone });

    return jsonResponse({
      token,
      user: { id, email: normalized.email ?? null, phone: normalized.phone ?? null, role, created_at: now, updated_at: now },
    });
  }

  if (pathname === "/api/auth/login" && request.method === "POST") {
    const body = await request.json();
    const identifier = String(body.identifier ?? "").trim();
    const password = String(body.password ?? "");

    if (!identifier || !password) {
      return errorResponse("Identifier and password are required.");
    }

    const normalized = normalizeIdentifier(identifier);
    const query: Record<string, unknown> = {};
    if (normalized.email) query.email = normalized.email;
    if (normalized.phone) query.phone = normalized.phone;

    const user = await users.findOne(query);
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return errorResponse("Invalid email/phone or password.");
    }

    const token = await createAuthToken({ sub: user._id.toString(), role: user.role, email: user.email, phone: user.phone });
    return jsonResponse({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });
  }

  if (pathname === "/api/auth/me" && request.method === "GET") {
    const user = await requireUser(request);
    return jsonResponse({
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    });
  }

  if (pathname === "/api/auth/account" && request.method === "PATCH") {
    const user = await requireUser(request);
    const body = await request.json();

    const email = body.email ? String(body.email).trim().toLowerCase() : user.email;
    const phone = body.phone ? String(body.phone).trim().replace(/[^0-9+]/g, "") : user.phone;
    const password = body.password ? String(body.password) : undefined;
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (email && email !== user.email) {
      const existing = await users.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return errorResponse("That email address is already in use.");
      }
      updates.email = email;
    }

    if (phone && phone !== user.phone) {
      const existing = await users.findOne({ phone });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return errorResponse("That phone number is already in use.");
      }
      updates.phone = phone;
    }

    if (password) {
      if (password.length < 6) {
        return errorResponse("Password must be at least 6 characters.");
      }
      updates.passwordHash = await hashPassword(password);
    }

    const updatedUser = await users.findOneAndUpdate({ _id: user._id }, { $set: updates }, { returnDocument: "after" });
    if (!updatedUser) {
      return errorResponse("Unable to update account.");
    }

    return jsonResponse({
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      created_at: updatedUser.createdAt,
      updated_at: updatedUser.updatedAt,
    });
  }

  return errorResponse("Not found", 404);
}

async function handleCollectionRoutes(request: Request, pathname: string, collectionName: CollectionName) {
  const collections = await getMongoCollections();
  const collection = collections[collectionName];
  const routeBase = routeBaseForCollection(collectionName);
  const idMatch = pathname.match(new RegExp(`^/api/${routeBase}/([^/]+)$`));
  const url = new URL(request.url);

  if (request.method === "GET" && pathname === `/api/${routeBase}/count`) {
    const query = buildQuery(collectionName, url);
    const count = await collection.countDocuments(query);
    return jsonResponse({ count });
  }

  if (request.method === "GET" && pathname === `/api/${routeBase}`) {
    const query = buildQuery(collectionName, url);
    const limit = Number(url.searchParams.get("limit")) || undefined;
    let cursor = collection.find(query).sort({ createdAt: -1 });
    if (limit && limit > 0) cursor = cursor.limit(limit);
    const items = await cursor.toArray();
    if (collectionName === "categories" || collectionName === "products") {
      const categoryLookups =
        collectionName === "products"
          ? buildCategoryLookups(await collections.categories.find({}).toArray())
          : undefined;
      const normalized = await Promise.all(
        items.map((item) =>
          normalizeManagedCollectionDocument(
            collections,
            collectionName,
            item as Record<string, unknown> & { _id?: ObjectId },
            categoryLookups,
          ),
        ),
      );
      return jsonResponse(
        normalized.map((item) => serializeDocument(item as Record<string, unknown> & { _id?: ObjectId })),
      );
    }

    return jsonResponse(items.map((item) => serializeDocument(item)));
  }

  if (request.method === "POST" && pathname === `/api/${routeBase}`) {
    const body = await request.json();
    const now = new Date().toISOString();
    const normalized =
      collectionName === "categories" || collectionName === "products"
        ? await normalizeManagedCollectionDocument(
            collections,
            collectionName,
            body as Record<string, unknown>,
          )
        : (body as Record<string, unknown>);
    const payload = { ...normalized, createdAt: now, updatedAt: now };
    delete (payload as Record<string, unknown>)._id;
    const result = await collection.insertOne(payload);
    return jsonResponse({ id: result.insertedId.toString(), ...payload });
  }

  if ((request.method === "PUT" || request.method === "PATCH") && idMatch) {
    const id = idMatch[1];
    const body = await request.json();
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return errorResponse("Item not found", 404);

    const merged =
      collectionName === "categories" || collectionName === "products"
        ? await normalizeManagedCollectionDocument(
            collections,
            collectionName,
            { ...existing, ...body, _id: existing._id } as Record<string, unknown> & { _id?: ObjectId },
          )
        : ({ ...existing, ...body } as Record<string, unknown>);
    const update = {
      ...merged,
      createdAt:
        firstNonEmptyString(existing.createdAt, (merged as Record<string, unknown>).createdAt) ??
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    delete (update as Record<string, unknown>)._id;
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    );
    if (!result) return errorResponse("Item not found", 404);
    return jsonResponse(serializeDocument(result));
  }

  if (request.method === "DELETE" && idMatch) {
    const id = idMatch[1];
    await collection.deleteOne({ _id: new ObjectId(id) });
    return jsonResponse({ success: true });
  }

  return errorResponse("Not found", 404);
}

async function handleUploadRoutes(request: Request, pathname: string) {
  const { generated_pdfs } = await getMongoCollections();

  const uploadsDir = process.env.UPLOADS_DIR || path.join(appRootDir, "uploads");
  await mkdir(uploadsDir, { recursive: true });

  // POST /api/uploads - accept JSON { filename, contentType, data(base64) }
  if (pathname === "/api/uploads" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return errorResponse("Invalid upload payload", 400);
    const origFilename = String((body as any).filename ?? "file");
    const contentType = String((body as any).contentType ?? "application/octet-stream");
    const dataBase64 = String((body as any).data ?? "");
    if (!dataBase64) return errorResponse("No file data provided", 400);

    const extFromName = path.extname(origFilename).replace(/^\./, "");
    const extFromType = (contentType.split("/")[1] || "bin").replace(/[^a-z0-9]+/gi, "");
    const ext = extFromName || extFromType || "bin";
    const filename = `${randomUUID()}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    try {
      await writeFile(filePath, Buffer.from(dataBase64, "base64"));
    } catch (err) {
      return errorResponse("Failed to write upload", 500);
    }

    const now = new Date().toISOString();
    const doc = {
      filename,
      originalFilename: origFilename,
      contentType,
      filePath,
      createdAt: now,
      updatedAt: now,
    };

    const result = await generated_pdfs.insertOne(doc as any);
    return jsonResponse({ id: result.insertedId.toString(), url: `/api/uploads/${result.insertedId.toString()}` }, 201);
  }

  // GET /api/uploads/:id - return file (reads filePath or falls back to stored base64)
  const idMatch = pathname.match(/^\/api\/uploads\/([^/]+)$/);
  if (idMatch && request.method === "GET") {
    const id = idMatch[1];
    try {
      const doc = await generated_pdfs.findOne({ _id: new ObjectId(id) });
      if (!doc) return errorResponse("Not found", 404);

      if (doc.filePath) {
        try {
          const buf = await readFile(doc.filePath);
          return new Response(buf, { status: 200, headers: { "content-type": doc.contentType ?? "application/octet-stream", "content-disposition": `attachment; filename="${doc.originalFilename ?? doc.filename ?? "file"}"` } });
        } catch (err) {
          return errorResponse("File missing on disk", 404);
        }
      }

      const base64 = doc.dataBase64 ?? doc.data ?? null;
      if (!base64) return errorResponse("No file data", 404);
      const buffer = Buffer.from(base64, "base64");
      return new Response(buffer, { status: 200, headers: { "content-type": doc.contentType ?? "application/octet-stream", "content-disposition": `attachment; filename="${doc.filename ?? "file"}"` } });
    } catch (err) {
      return errorResponse("Invalid id", 400);
    }
  }

  // Sign endpoint: instructs client to POST to /api/uploads when no cloud configured
  if (pathname === "/api/uploads/sign" && request.method === "POST") {
    return jsonResponse({ strategy: "direct", uploadUrl: "/api/uploads", method: "POST", note: "Send JSON { filename, contentType, data } where data is base64" });
  }

  return errorResponse("Not found", 404);
}
