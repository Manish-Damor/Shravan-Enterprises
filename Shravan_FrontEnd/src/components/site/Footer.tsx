import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { fetchPublicCatalog, getFallbackCatalog } from "@/lib/catalog";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  const { data: catalog } = useQuery({
    queryKey: ["public-catalog"],
    queryFn: fetchPublicCatalog,
    staleTime: 5 * 60 * 1000,
  });
  const activeCatalog = catalog ?? getFallbackCatalog();
  const footerCategories = [...(activeCatalog.categories ?? [])]
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
    .slice(0, 6);

  return (
    <footer className="relative mt-24 text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.65 0.18 152 / 0.3), transparent 50%)" }} />
      <div className="relative container mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <BrandLogo
              logoWrapClassName="border-white/12 bg-white/96"
              imageClassName="h-9"
              textClassName="text-white"
              subtitleClassName="text-white/58"
            />
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            ISO 9001:2015 certified supplier of premium FRP raw materials, fiberglass, marble & granite consumables since 2018.
          </p>
          <div className="flex gap-3 mt-6">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-smooth">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-base">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[["/about", "About Us"], ["/products", "Products"], ["/industries", "Industries"], ["/certifications", "Certifications"], ["/gallery", "Gallery"]].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition-smooth">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-base">Product Categories</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {footerCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  to="/products/$slug"
                  params={{ slug: category.slug }}
                  className="hover:text-white transition-smooth"
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-base">Reach Us</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /><span>Sri Residency E-Tower, Shop No. 1 & 2, Village Borkud Faliya, Silvassa – 396230, DNH</span></li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 shrink-0" /><span>+91 98241 24043<br />+91 98241 24073</span></li>
            <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 shrink-0" /><a href="mailto:shravanenterprises1312@gmail.com" className="break-all hover:text-white">shravanenterprises1312@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-6 py-5 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Shravan Enterprises. All rights reserved. · ISO 9001:2015 Certified Company
        </div>
      </div>
    </footer>
  );
}
