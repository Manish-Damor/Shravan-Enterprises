import { describe, expect, it } from "vitest";
import { buildProductJsonLd, buildProductMeta } from "./seo";

const sampleProduct = {
  id: "p1",
  slug: "sample-product",
  name: "Sample Product",
  short_description: "A short description",
  detailed_description: "Detailed description",
  image: "/images/sample.jpg",
  gallery_images: ["/images/sample.jpg", "/images/sample-2.jpg"],
  specifications: { weight: "10kg", material: "FRP" },
  tds_pdf: "/files/sample-tds.pdf",
  brochure_pdf: "/files/sample-brochure.pdf",
};

const sampleCategory = { id: "c1", slug: "cat", title: "Category" };

describe("SEO helpers", () => {
  it("buildProductMeta returns expected fields", () => {
    const meta = buildProductMeta(sampleProduct as any, sampleCategory as any);

    expect(meta.title).toContain("Sample Product");
    expect(meta.description).toBe(sampleProduct.short_description);
    expect(meta.image).toBe(sampleProduct.image);
    expect(meta.canonical).toBe("/product/sample-product");
    expect(Array.isArray(meta.keywords)).toBeTruthy();
  });

  it("buildProductJsonLd returns a valid Product schema", () => {
    const json = buildProductJsonLd(sampleProduct as any, sampleCategory as any);

    expect(json).not.toBeNull();
    expect(json?.["@type"]).toBe("Product");
    expect(json?.name).toBe(sampleProduct.name);
    expect(json?.url).toBe("/product/sample-product");
    expect(Array.isArray(json?.image)).toBeTruthy();
    expect(Array.isArray(json?.hasPart)).toBeTruthy();
  });
});
