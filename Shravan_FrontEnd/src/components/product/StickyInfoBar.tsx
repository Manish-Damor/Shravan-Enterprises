import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, Tag } from "lucide-react";
import type {
  NormalizedCategory,
  NormalizedProduct,
} from "@/lib/product-normalizer";

export default function StickyInfoBar({
  product,
  category,
}: {
  product: NormalizedProduct;
  category: NormalizedCategory | null;
}) {
  return (
    <motion.div
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 border-b border-border/70 bg-white/92 shadow-[0_12px_40px_-32px_rgba(15,23,42,0.5)] backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center gap-6 px-6 py-3 text-sm text-foreground">
        <div className="flex items-center gap-3">
          <Tag className="h-4 w-4 text-amber-500" />
          <span className="font-medium">{product.name}</span>
        </div>
        <div className="flex items-center gap-3 text-foreground/85">
          <strong className="text-foreground">Type:</strong>
          <span>{product.characteristics ?? product.subtitle ?? "-"}</span>
        </div>
        <div className="flex items-center gap-3 text-foreground/85">
          <strong className="text-foreground">Category:</strong>
          <span>{category?.title ?? product.category_title ?? product.category_slug}</span>
        </div>
        <div className="flex items-center gap-3 text-foreground/85">
          <strong className="text-foreground">Unit:</strong>
          <span>{product.unit_of_measurement ?? "-"}</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <a
            href={`https://wa.me/919824124043?text=${encodeURIComponent(
              `Interested in ${product.name} (SKU: ${product.slug})`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded bg-amber-400 px-4 py-2 font-semibold text-black"
          >
            <Phone className="h-4 w-4" /> WhatsApp
          </a>
          <Link
            to="/contact"
            className="rounded border border-border bg-white px-4 py-2 text-foreground transition hover:bg-secondary"
          >
            Quick Inquiry
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
