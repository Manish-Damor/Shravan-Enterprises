import type { NormalizedCategory, NormalizedProduct } from "./product-normalizer";

const SITE_NAME = "Shravan Enterprises";
const DEFAULT_IMAGE = "/src/assets/hero-industrial.jpg";

export function buildProductMeta(
  product: NormalizedProduct | null,
  category: NormalizedCategory | null,
) {
  const title = product
    ? `${product.name} - ${SITE_NAME}`
    : `Products - ${SITE_NAME}`;
  const description =
    product?.short_description ??
    product?.detailed_description ??
    category?.tagline ??
    "Premium industrial products and solutions.";
  const image = product?.image ?? category?.image ?? DEFAULT_IMAGE;
  const canonical = product ? `/product/${product.slug}` : "/products";

  const specKeys =
    product?.specifications && typeof product.specifications === "object"
      ? Object.keys(product.specifications)
      : [];
  const keywords = [
    ...new Set([...(specKeys as string[]), category?.title ?? "", product?.name ?? ""]),
  ]
    .filter(Boolean)
    .slice(0, 12);

  return { title, description, image, canonical, keywords, siteName: SITE_NAME };
}

export function buildProductJsonLd(
  product: NormalizedProduct | null,
  category: NormalizedCategory | null,
) {
  if (!product) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description:
      product.short_description ?? product.detailed_description ?? undefined,
    sku: product.slug,
    url: `/product/${product.slug}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: category?.title ?? product.category_title ?? product.category_slug ?? undefined,
  };

  if (product.image) {
    schema.image =
      Array.isArray(product.gallery_images) && product.gallery_images.length > 0
        ? product.gallery_images
        : [product.image];
  }

  if (product.specifications && typeof product.specifications === "object") {
    const additionalProperty = Object.entries(product.specifications).map(
      ([name, value]) => ({
        "@type": "PropertyValue",
        name,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
      }),
    );
    if (additionalProperty.length > 0) {
      schema.additionalProperty = additionalProperty;
    }
  }

  const docs = [product.tds_pdf, product.brochure_pdf].filter(
    (value): value is string => Boolean(value),
  );
  if (docs.length > 0) {
    schema.hasPart = docs.map((url) => ({
      "@type": "MediaObject",
      contentUrl: url,
    }));
  }

  return schema;
}
