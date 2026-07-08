import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductPage from "@/components/product/ProductPage";
import { Link } from "@/lib/router";
import { getPublicCatalogQueryOptions } from "@/lib/catalog";
import {
  normalizeCategory,
  normalizeProduct,
  pickRelatedProducts,
} from "@/lib/product-normalizer";

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const { data: catalog, isLoading } = useQuery(getPublicCatalogQueryOptions());

  const data = useMemo(() => {
    const categories = (catalog?.categories ?? [])
      .map(normalizeCategory)
      .filter((category): category is NonNullable<typeof category> => category !== null);
    const products = (catalog?.products ?? [])
      .map(normalizeProduct)
      .filter((product): product is NonNullable<typeof product> => product !== null);
    const product = products.find((item) => item.slug === slug) ?? null;
    const category = categories.find((item) => item.slug === product?.category_slug) ?? null;
    const related = product
      ? pickRelatedProducts(products, product.slug, product.category_slug ?? undefined, 8)
      : [];

    return { product, category, related, categories };
  }, [catalog, slug]);

  if (isLoading) {
    return <div className="container mx-auto px-6 py-32 text-center">Loading product...</div>;
  }

  if (!data.product) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-4xl font-bold">Product not found</h1>
        <p className="mt-3 text-muted-foreground">
          The requested product could not be found in the public catalog.
        </p>
        <Link to="/products" className="mt-6 inline-block font-semibold text-primary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <ProductPage
      product={data.product}
      category={data.category}
      related={data.related}
      categories={data.categories}
    />
  );
}
