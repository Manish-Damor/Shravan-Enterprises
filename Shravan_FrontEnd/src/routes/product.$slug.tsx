import { createFileRoute, Link, notFound } from "@/lib/tanstack-router-compat";
import ProductPage from "@/components/product/ProductPage";
import { fetchPublicCatalog } from "@/lib/catalog";
import {
  normalizeCategory,
  normalizeProduct,
  pickRelatedProducts,
} from "@/lib/product-normalizer";
import { buildProductJsonLd, buildProductMeta } from "@/lib/seo";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const catalog = await fetchPublicCatalog();
    const categories = (catalog.categories ?? [])
      .map(normalizeCategory)
      .filter((category): category is NonNullable<typeof category> => category !== null);
    const products = (catalog.products ?? [])
      .map(normalizeProduct)
      .filter((product): product is NonNullable<typeof product> => product !== null);

    const product = products.find((item) => item.slug === params.slug) ?? null;
    if (!product) throw notFound();

    const category =
      categories.find((item) => item.slug === product.category_slug) ?? null;
    const related = pickRelatedProducts(
      products,
      product.slug,
      product.category_slug ?? undefined,
      8,
    );

    return { product, category, related, categories };
  },
  head: ({ loaderData }) => {
    const meta = buildProductMeta(
      loaderData?.product ?? null,
      loaderData?.category ?? null,
    );
    const jsonLd = buildProductJsonLd(
      loaderData?.product ?? null,
      loaderData?.category ?? null,
    );

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { name: "keywords", content: meta.keywords.join(", ") },
        { name: "robots", content: "index,follow" },
        {
          property: "og:type",
          content: loaderData?.product ? "product" : "website",
        },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        { property: "og:image", content: meta.image },
        { property: "og:site_name", content: meta.siteName },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: meta.title },
        { name: "twitter:description", content: meta.description },
        { name: "twitter:image", content: meta.image },
      ],
      links: [{ rel: "canonical", href: meta.canonical }],
      scripts: jsonLd
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(jsonLd),
            },
          ]
        : undefined,
    };
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-6 py-32 text-center">
      <h1 className="text-4xl font-bold">Product not found</h1>
      <p className="mt-3 text-muted-foreground">
        The requested product could not be found in the public catalog.
      </p>
      <Link to="/products" className="mt-6 inline-block font-semibold text-primary">
        Browse products
      </Link>
    </div>
  ),
  component: ProductView,
});

function ProductView() {
  const { product, category, related, categories } = Route.useLoaderData();

  return (
    <ProductPage
      product={product}
      category={category}
      related={related}
      categories={categories}
    />
  );
}
