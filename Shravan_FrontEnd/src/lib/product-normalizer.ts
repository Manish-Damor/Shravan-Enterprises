type MediaLike =
  | string
  | null
  | undefined
  | {
      url?: unknown;
      value?: unknown;
    };

type FileLike = {
  key?: unknown;
  url?: unknown;
  value?: unknown;
  name?: unknown;
  filename?: unknown;
  type?: unknown;
};

export type ProductSpec = Record<string, unknown>;

export type NormalizedProductFile = {
  key: string;
  url: string;
  name: string;
  type: string | null;
};

export type NormalizedProduct = {
  id: string | null;
  slug: string;
  name: string;
  subtitle?: string | null;
  characteristics?: string | null;
  category_id?: string | null;
  category_slug?: string | null;
  category_title?: string | null;
  featured?: boolean;
  image?: string | null;
  gallery_images?: string[];
  applications?: string[];
  application_rows?: Array<{ title: string; description?: string | null }>;
  industries?: string[];
  tags?: string[];
  short_description?: string | null;
  detailed_description?: string | null;
  key_features?: string | null;
  unit_of_measurement?: string | null;
  moq?: string | null;
  available_packing_size?: string | null;
  technical_specifications?: string | null;
  specification_rows?: Array<Record<string, unknown>>;
  specifications?: ProductSpec | null;
  files?: NormalizedProductFile[];
  tds_pdf?: string | null;
  brochure_pdf?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type NormalizedCategory = {
  id: string | null;
  slug: string;
  title: string;
  tagline?: string;
  image?: string;
  items?: string[];
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) return [] as string[];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        return (
          asString(record.label) ||
          asString(record.name) ||
          asString(record.title) ||
          asString(record.value) ||
          asString(record.property)
        );
      }
      return "";
    })
    .filter(Boolean);
}

function readMediaUrl(value: MediaLike) {
  if (!value) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof value === "object") {
    const url = asString(value.url);
    if (url) return url;
    const fallback = asString(value.value);
    return fallback || null;
  }
  return null;
}

function normalizeFiles(rawFiles: unknown): NormalizedProductFile[] {
  if (!Array.isArray(rawFiles)) return [];

  return rawFiles
    .map((file) => {
      if (!file || typeof file !== "object") return null;
      const entry = file as FileLike;
      const key = asString(entry.key);
      const url = readMediaUrl(entry.url as MediaLike) ?? readMediaUrl(entry.value as MediaLike);
      if (!key || !url) return null;

      return {
        key,
        url,
        name: asString(entry.name) || asString(entry.filename) || key,
        type: asString(entry.type) || null,
      };
    })
    .filter((file): file is NormalizedProductFile => file !== null);
}

function findFileUrl(files: NormalizedProductFile[], keys: string[]) {
  const normalizedKeys = new Set(keys);
  const match = files.find((file) => normalizedKeys.has(file.key));
  return match?.url ?? null;
}

export function normalizeCategory(raw: unknown): NormalizedCategory | null {
  if (!raw || typeof raw !== "object") return null;

  const category = raw as Record<string, unknown>;
  const slug = asString(category.slug);
  const title = asString(category.title) || asString(category.name);

  if (!slug || !title) return null;

  return {
    id: category.id ? String(category.id) : category._id ? String(category._id) : null,
    slug,
    title,
    tagline:
      asString(category.tagline) ||
      asString(category.short_description) ||
      asString(category.shortDescription) ||
      asString(category.description),
    image:
      readMediaUrl(category.image as MediaLike) ??
      readMediaUrl(category.banner_image as MediaLike) ??
      readMediaUrl(category.bannerImageUrl as MediaLike) ??
      "",
    items: Array.isArray(category.items)
      ? category.items.map((item) => String(item).trim()).filter(Boolean)
      : [],
  };
}

export function normalizeProduct(raw: unknown): NormalizedProduct | null {
  if (!raw || typeof raw !== "object") return null;

  const product = raw as Record<string, unknown>;
  const slug = asString(product.slug);
  const name = asString(product.name) || asString(product.title);
  if (!slug || !name) return null;

  const files = normalizeFiles(product.files);
  const galleryImages = Array.isArray(product.gallery_images)
    ? product.gallery_images
        .map((item) => readMediaUrl(item as MediaLike))
        .filter((item): item is string => Boolean(item))
    : [];

  const specificationRows = Array.isArray(product.specification_rows)
    ? product.specification_rows.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
    : [];

  const technicalSummary = asString(product.technical_specifications) || null;
  const specifications =
    specificationRows.length > 0
      ? specificationRows
      : technicalSummary ??
        product.specifications ??
        null;

  return {
    id: product.id ? String(product.id) : product._id ? String(product._id) : null,
    slug,
    name,
    subtitle: product.subtitle ? String(product.subtitle) : null,
    characteristics: product.characteristics ? String(product.characteristics) : null,
    category_id: product.category_id ? String(product.category_id) : null,
    category_slug: product.category_slug ? String(product.category_slug) : null,
    category_title: product.category_title ? String(product.category_title) : null,
    featured: Boolean(product.featured),
    image:
      readMediaUrl(product.image as MediaLike) ??
      readMediaUrl(product.primary_image as MediaLike) ??
      readMediaUrl(product.og_image as MediaLike),
    gallery_images: galleryImages,
    applications: asStringArray(product.applications),
    application_rows: Array.isArray(product.application_rows)
      ? product.application_rows
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const row = item as Record<string, unknown>;
            const title =
              asString(row.title) ||
              asString(row.name) ||
              asString(row.label) ||
              asString(row.application);
            if (!title) return null;
            return {
              title,
              description: asString(row.description) || asString(row.notes) || null,
            };
          })
          .filter(
            (
              item,
            ): item is { title: string; description?: string | null } => item !== null,
          )
      : [],
    industries: asStringArray(product.industries ?? product.industries_served),
    tags: asStringArray(product.tags),
    short_description: product.short_description ? String(product.short_description) : null,
    detailed_description: product.detailed_description ? String(product.detailed_description) : null,
    key_features: product.key_features ? String(product.key_features) : null,
    unit_of_measurement: product.unit_of_measurement ? String(product.unit_of_measurement) : null,
    moq: product.moq ? String(product.moq) : null,
    available_packing_size: product.available_packing_size ? String(product.available_packing_size) : null,
    technical_specifications: technicalSummary,
    specification_rows: specificationRows,
    specifications: specifications as ProductSpec | null,
    files,
    tds_pdf:
      readMediaUrl(product.tds_pdf as MediaLike) ??
      findFileUrl(files, ["tds_pdf", "tds"]),
    brochure_pdf:
      readMediaUrl(product.brochure_pdf as MediaLike) ??
      findFileUrl(files, ["brochure_pdf", "brochure"]),
    createdAt: product.createdAt ? String(product.createdAt) : null,
    updatedAt: product.updatedAt ? String(product.updatedAt) : null,
  };
}

export function pickRelatedProducts(
  all: unknown[],
  currentSlug: string,
  categorySlug?: string,
  limit = 6,
) {
  return all
    .map(normalizeProduct)
    .filter((product): product is NormalizedProduct => product !== null)
    .filter(
      (product) =>
        product.slug !== currentSlug &&
        (categorySlug ? product.category_slug === categorySlug : true),
    )
    .sort((left, right) => Number(right.featured) - Number(left.featured))
    .slice(0, limit);
}
