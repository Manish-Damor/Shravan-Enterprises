import type {
  NormalizedCategory,
  NormalizedProduct,
} from "@/lib/product-normalizer";
import CategoryNav from "./CategoryNav";
import DocumentCenter from "./DocumentCenter";
import InquiryForm from "./InquiryForm";
import ProductGallery from "./ProductGallery";
import ProductHero from "./ProductHero";
import ProductOverview from "./ProductOverview";
import RelatedProducts from "./RelatedProducts";
import SpecsTable from "./SpecsTable";
import StickyInfoBar from "./StickyInfoBar";

type Props = {
  product: NormalizedProduct | null;
  category: NormalizedCategory | null;
  related: NormalizedProduct[];
  categories?: NormalizedCategory[];
};

export default function ProductPage({
  product,
  category,
  related,
  categories,
}: Props) {
  if (!product) return <div className="container mx-auto p-8">Product not found</div>;

  return (
    <div className="product-page">
      <ProductHero product={product} category={category} />
      <StickyInfoBar product={product} category={category} />

      <main className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[linear-gradient(180deg,_oklch(0.97_0.01_150),_transparent)]" />
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_360px]">
            <div className="space-y-8">
              <ProductOverview product={product} />
              <SpecsTable
                specs={product.specifications}
                summary={product.technical_specifications}
              />
              <DocumentCenter product={product} />
            </div>

            <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <ProductGallery
                images={
                  product.gallery_images && product.gallery_images.length > 0
                    ? product.gallery_images
                    : product.image
                      ? [product.image]
                      : []
                }
              />
              <InquiryForm product={product} />
            </aside>
          </div>

          <div className="mt-14 space-y-8">
            <div className="overflow-hidden rounded-[2.2rem] border border-border/80 bg-[linear-gradient(180deg,_oklch(0.985_0.005_150),_oklch(0.965_0.01_150))] shadow-card">
              <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[0.8fr_1.2fr] xl:items-start">
                <div className="xl:pr-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                    Explore More
                  </div>
                  <h2 className="mt-3 text-3xl font-bold leading-tight text-foreground">
                    Browse other categories
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
                    Move across the catalog without losing context. Each category opens its own dedicated overview with product previews and a clean path into individual product pages.
                  </p>
                </div>
                <div>
                  <div className="mb-4 h-px w-full bg-[linear-gradient(90deg,_transparent,_oklch(0.87_0.015_150),_transparent)] xl:hidden" />
                  <div className="rounded-[1.8rem] border border-white/65 bg-white/70 p-3 md:p-4">
                    <CategoryNav categories={categories ?? []} active={category?.slug ?? null} />
                  </div>
                </div>
              </div>
            </div>
            <RelatedProducts items={related} />
          </div>
        </div>
      </main>
    </div>
  );
}
