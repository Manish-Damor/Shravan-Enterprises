import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Package2, Sparkles, X } from "lucide-react";
import { getFallbackCatalog, getPublicCatalogQueryOptions } from "@/lib/catalog";
import { Link, usePathname } from "@/lib/router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandLogo } from "./BrandLogo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/industries", label: "Industries" },
  { to: "/certifications", label: "Certifications" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
  { to: "/brochure", label: "Brochure" },
] as const;

type MenuCategory = {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  items: string[];
  productCount: number;
};

type MenuProduct = {
  slug: string;
  name: string;
  categorySlug: string | null;
  tags: string[];
};

function isProductsPath(pathname: string) {
  return (
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/product/")
  );
}

function getPreferredCategorySlug(categories: MenuCategory[]) {
  const mostPopulatedCategory = [...categories].sort((left, right) => {
    if (right.productCount !== left.productCount) {
      return right.productCount - left.productCount;
    }

    return right.items.length - left.items.length;
  })[0];

  if ((mostPopulatedCategory?.productCount ?? 0) > 0) {
    return mostPopulatedCategory?.slug ?? null;
  }

  if ((mostPopulatedCategory?.items.length ?? 0) > 0) {
    return mostPopulatedCategory?.slug ?? null;
  }

  return categories[0]?.slug ?? null;
}

export function Navbar() {
  const pathname = usePathname();
  const { data: catalog } = useQuery(getPublicCatalogQueryOptions());

  const fallbackCatalog = getFallbackCatalog();
  const catalogProducts = catalog?.products ?? fallbackCatalog.products;
  const categories: MenuCategory[] = (catalog?.categories ?? fallbackCatalog.categories).map(
    (category) => {
      const productCount = catalogProducts.filter(
        (product) => product.category_slug === category.slug,
      ).length;

      return {
        slug: category.slug,
        title: category.title,
        tagline: category.tagline,
        image: category.image,
        items: category.items,
        productCount,
      };
    },
  );

  const products: MenuProduct[] = catalogProducts.map((product) => ({
    slug: product.slug,
    name: product.name,
    categorySlug: product.category_slug,
    tags: product.tags ?? [],
  }));

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(() =>
    getPreferredCategorySlug(categories),
  );
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const openProductsMenu = () => setProductsOpen(true);
  const closeProductsMenu = () => setProductsOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!categories.length) {
      setActiveCategorySlug(null);
      return;
    }

    const activeExists = categories.some((category) => category.slug === activeCategorySlug);
    if (!activeExists) {
      setActiveCategorySlug(getPreferredCategorySlug(categories));
    }
  }, [activeCategorySlug, categories]);

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
  }, [pathname]);

  const activeCategory =
    categories.find((category) => category.slug === activeCategorySlug) ?? categories[0] ?? null;

  const activeProducts = products.filter(
    (product) => product.categorySlug === activeCategory?.slug,
  );
  const visibleProducts =
    activeProducts.length > 0
      ? activeProducts
      : (activeCategory?.items ?? []).map((item) => ({
          slug: activeCategory?.slug ?? item,
          name: item,
          categorySlug: activeCategory?.slug ?? null,
          tags: [],
        }));
  const isHomePage = pathname === "/";
  const useHeroNavbar = isHomePage && !scrolled;

  const headerClassName = useHeroNavbar
    ? "border-b border-white/10 bg-[linear-gradient(180deg,rgba(6,32,19,0.74),rgba(6,32,19,0.42)_58%,rgba(6,32,19,0))] text-white"
    : scrolled
      ? "border-b border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,251,248,0.86))] text-foreground shadow-[0_20px_60px_-28px_rgba(16,81,50,0.28)] backdrop-blur-2xl"
      : "border-b border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.62))] text-foreground shadow-[0_18px_45px_-35px_rgba(16,81,50,0.22)] backdrop-blur-xl";

  const navLinkClassName = useHeroNavbar
    ? "relative rounded-full px-4 py-2 text-sm font-medium text-white/78 transition-smooth hover:bg-white/8 hover:text-white after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-emerald-300 after:transition-all after:content-[''] hover:after:w-6"
    : "relative rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-smooth hover:bg-primary/6 hover:text-primary after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all after:content-[''] hover:after:w-6";
  const navActiveClassName = useHeroNavbar ? "bg-white/10 text-white" : "bg-primary/8 text-primary";
  const productsButtonClassName = useHeroNavbar
    ? `relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-smooth ${
        isProductsPath(pathname)
          ? "bg-white/10 text-white"
          : "text-white/78 hover:bg-white/8 hover:text-white"
      }`
    : `relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-smooth ${
        isProductsPath(pathname)
          ? "bg-primary/8 text-primary"
          : "text-foreground/80 hover:bg-primary/6 hover:text-primary"
      }`;
  const productsChevronClassName = useHeroNavbar
    ? `h-4 w-4 transition-smooth ${productsOpen ? "rotate-180 text-emerald-300" : "text-white/65"}`
    : `h-4 w-4 transition-smooth ${productsOpen ? "rotate-180 text-primary" : ""}`;
  const mobileButtonClassName = useHeroNavbar
    ? "lg:hidden p-2 text-white"
    : "lg:hidden p-2 text-foreground";
  const mobilePanelClassName = useHeroNavbar
    ? "mt-3 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,37,22,0.92),rgba(9,47,29,0.82))] px-6 py-4 text-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-fade-in lg:hidden"
    : "mt-3 rounded-[1.6rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,251,248,0.9))] px-6 py-4 animate-fade-in shadow-card backdrop-blur-2xl lg:hidden";
  const mobileLinkClassName = useHeroNavbar
    ? "rounded-lg px-4 py-3 text-sm font-medium text-white/84 hover:bg-white/8 hover:text-white"
    : "rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-smooth ${headerClassName}`}>
      <div className="site-container px-1">
        <div className="flex h-[var(--navbar-height)] items-center justify-between gap-4">
          <Link to="/" className="group flex min-w-0 items-center">
            <BrandLogo
              className="transition-smooth group-hover:scale-[1.02]"
              logoWrapClassName={`${
                useHeroNavbar
                  ? "border-white/12 bg-white/98 shadow-[0_18px_42px_-24px_rgba(0,0,0,0.55)]"
                  : "border-primary/8 bg-white/96"
              } px-0.5`}
              imageClassName="h-9 scale-[1.15] sm:h-10 md:h-[2.75rem]"
              copyClassName="min-w-0"
              textClassName={`${useHeroNavbar ? "text-white" : "text-foreground"} text-[0.95rem] sm:text-base`}
              subtitleClassName={`${useHeroNavbar ? "text-white/58" : "text-muted-foreground"} text-[9px] sm:text-[10px]`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {links.slice(0, 2).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={navLinkClassName}
                activeProps={{ className: navActiveClassName }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={openProductsMenu}
              onMouseLeave={closeProductsMenu}
            >
              <button
                type="button"
                onFocus={openProductsMenu}
                onClick={() => setProductsOpen((current) => !current)}
                className={productsButtonClassName}
                aria-expanded={productsOpen}
                aria-haspopup="true"
              >
                Products
                <ChevronDown className={productsChevronClassName} />
                <span
                  className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 transition-all ${
                    useHeroNavbar ? "bg-emerald-300" : "bg-primary"
                  } ${isProductsPath(pathname) || productsOpen ? "w-6" : "w-0"}`}
                />
              </button>

              {productsOpen && activeCategory ? (
                <div className="absolute left-1/2 top-full z-50 mt-5 w-[min(1120px,calc(100vw-48px))] -translate-x-1/2">
                  <div className="absolute inset-x-0 -top-5 h-5" />
                  <div className="overflow-hidden rounded-[2rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,249,0.96))] shadow-[0_32px_90px_-30px_rgba(16,81,50,0.38)] backdrop-blur-2xl">
                    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(16,81,50,0.32),transparent)]" />
                    <div className="grid h-[min(600px,calc(100vh-120px))] grid-cols-[320px_1fr]">
                      <div className="relative flex h-full min-h-0 flex-col overflow-hidden border-r border-border/70 bg-[linear-gradient(180deg,rgba(16,81,50,0.04),rgba(16,81,50,0.01))] p-5">
                        <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-primary/8 blur-3xl" />
                        <div className="relative">
                          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            Product Library
                          </div>
                          <h3 className="mt-4 text-2xl font-bold text-foreground">
                            Browse by category
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Live categories from your system with direct access into category and
                            product pages.
                          </p>
                        </div>

                        <ScrollArea
                          type="always"
                          className="mt-6 min-h-0 flex-1 pr-1 [&_[data-orientation='vertical']]:w-3 [&_[data-radix-scroll-area-thumb]]:bg-primary/30"
                        >
                          <div className="space-y-2 pb-6 pr-2">
                            {categories.map((category) => {
                              const isActive = category.slug === activeCategory.slug;

                              return (
                                <button
                                  key={category.slug}
                                  type="button"
                                  onMouseEnter={() => setActiveCategorySlug(category.slug)}
                                  onFocus={() => setActiveCategorySlug(category.slug)}
                                  className={`flex w-full items-center gap-3 rounded-[1.4rem] border px-3 py-3 text-left transition-smooth ${
                                    isActive
                                      ? "border-primary/20 bg-white shadow-card"
                                      : "border-transparent hover:border-primary/10 hover:bg-white/70"
                                  }`}
                                >
                                  <img
                                    src={category.image || undefined}
                                    alt={category.title}
                                    className="h-12 w-12 rounded-2xl object-cover"
                                    loading="lazy"
                                    width={96}
                                    height={96}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-semibold text-foreground">
                                      {category.title}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                      {category.productCount > 0
                                        ? `${category.productCount} products`
                                        : `${category.items.length} category items`}
                                    </div>
                                  </div>
                                  <ChevronDown
                                    className={`h-4 w-4 shrink-0 transition-smooth ${
                                      isActive
                                        ? "-rotate-90 text-primary"
                                        : "-rotate-90 text-muted-foreground"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_290px] gap-0">
                        <div className="flex h-full min-h-0 flex-col p-6">
                          <div className="flex items-start justify-between gap-6 border-b border-border/70 pb-5">
                            <div className="max-w-2xl">
                              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
                                Active Category
                              </div>
                              <h3 className="mt-2 text-3xl font-bold text-foreground">
                                {activeCategory.title}
                              </h3>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {activeCategory.tagline}
                              </p>
                            </div>
                            <Link
                              to="/products/$slug"
                              params={{ slug: activeCategory.slug }}
                              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/12 bg-primary/6 px-4 py-2 text-sm font-semibold text-primary transition-smooth hover:bg-primary hover:text-primary-foreground"
                            >
                              View category
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>

                          <ScrollArea
                            type="always"
                            className="mt-6 min-h-0 flex-1 pr-1 [&_[data-orientation='vertical']]:w-3 [&_[data-radix-scroll-area-thumb]]:bg-primary/30"
                          >
                            <div className="grid gap-3 pb-8 pr-2 md:grid-cols-2">
                              {visibleProducts.map((product, index) =>
                                activeProducts.length > 0 ? (
                                  <Link
                                    key={product.slug}
                                    to="/product/$slug"
                                    params={{ slug: product.slug }}
                                    className="group rounded-[1.4rem] border border-border/75 bg-white/75 px-4 py-4 transition-smooth hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-card"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/60">
                                          {String(index + 1).padStart(2, "0")}
                                        </div>
                                        <div className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-foreground">
                                          {product.name}
                                        </div>
                                        {product.tags.length > 0 ? (
                                          <div className="mt-2 text-xs text-muted-foreground">
                                            {product.tags.slice(0, 2).join(" · ")}
                                          </div>
                                        ) : null}
                                      </div>
                                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                                    </div>
                                  </Link>
                                ) : (
                                  <div
                                    key={`${product.slug}-${product.name}`}
                                    className="rounded-[1.4rem] border border-border/75 bg-white/70 px-4 py-4"
                                  >
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/60">
                                      {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <div className="mt-2 text-sm font-semibold leading-6 text-foreground">
                                      {product.name}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </ScrollArea>
                        </div>

                        <div className="border-l border-border/70 bg-[linear-gradient(180deg,rgba(242,248,244,0.8),rgba(255,255,255,0.92))] p-6">
                          <div className="overflow-hidden rounded-[1.8rem] border border-white/70 bg-card shadow-card">
                            <img
                              src={activeCategory.image || undefined}
                              alt={activeCategory.title}
                              className="h-44 w-full object-cover"
                              loading="lazy"
                              width={640}
                              height={400}
                            />
                            <div className="p-5">
                              <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                                <Package2 className="h-3.5 w-3.5" />
                                {activeCategory.productCount > 0
                                  ? `${activeCategory.productCount} live products`
                                  : "Category overview"}
                              </div>
                              <h4 className="mt-4 text-xl font-bold text-foreground">
                                {activeCategory.title}
                              </h4>
                              <div className="mt-4 space-y-2">
                                {activeCategory.items.slice(0, 4).map((item) => (
                                  <div
                                    key={item}
                                    className="rounded-xl bg-secondary/60 px-3 py-2 text-sm text-foreground/80"
                                  >
                                    {item}
                                  </div>
                                ))}
                              </div>
                              <Link
                                to="/products/$slug"
                                params={{ slug: activeCategory.slug }}
                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                              >
                                Explore full category
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {links.slice(2).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={navLinkClassName}
                activeProps={{ className: navActiveClassName }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.03] hover:shadow-[0_0_40px_-8px_rgba(88,214,141,0.58)]"
          >
            Get a Quote
          </Link>

          <button
            className={mobileButtonClassName}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className={mobilePanelClassName}>
            <nav className="flex flex-col gap-1">
              <Link to="/" className={mobileLinkClassName}>
                Home
              </Link>
              <Link to="/about" className={mobileLinkClassName}>
                About
              </Link>

              <div
                className={`rounded-2xl p-2 ${
                  useHeroNavbar
                    ? "border border-white/10 bg-white/6"
                    : "border border-border/70 bg-white/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen((current) => !current)}
                  className={`flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm font-semibold ${
                    useHeroNavbar ? "text-white" : "text-foreground"
                  }`}
                >
                  <span>Products</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-smooth ${mobileProductsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {mobileProductsOpen ? (
                  <div className="mt-2 space-y-3 px-2 pb-2">
                    <Link
                      to="/products"
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${
                        useHeroNavbar ? "text-emerald-200" : "text-primary"
                      }`}
                    >
                      View all categories
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    {categories.map((category) => {
                      const mobileCategoryProducts = products.filter(
                        (product) => product.categorySlug === category.slug,
                      );

                      return (
                        <div
                          key={category.slug}
                          className={`rounded-[1.25rem] p-3 ${
                            useHeroNavbar
                              ? "border border-white/10 bg-white/8"
                              : "border border-border/70 bg-white/80"
                          }`}
                        >
                          <Link
                            to="/products/$slug"
                            params={{ slug: category.slug }}
                            className="flex items-center gap-3"
                          >
                            <img
                              src={category.image || undefined}
                              alt={category.title}
                              className="h-12 w-12 rounded-xl object-cover"
                              loading="lazy"
                              width={96}
                              height={96}
                            />
                            <div className="min-w-0">
                              <div
                                className={`truncate text-sm font-semibold ${useHeroNavbar ? "text-white" : "text-foreground"}`}
                              >
                                {category.title}
                              </div>
                              <div
                                className={
                                  useHeroNavbar
                                    ? "text-xs text-white/58"
                                    : "text-xs text-muted-foreground"
                                }
                              >
                                {category.productCount > 0
                                  ? `${category.productCount} products`
                                  : `${category.items.length} category items`}
                              </div>
                            </div>
                          </Link>

                          <div className="mt-3 space-y-2 pl-1">
                            {mobileCategoryProducts.length > 0
                              ? mobileCategoryProducts.slice(0, 3).map((product) => (
                                  <Link
                                    key={product.slug}
                                    to="/product/$slug"
                                    params={{ slug: product.slug }}
                                    className={`block text-sm transition ${
                                      useHeroNavbar
                                        ? "text-white/76 hover:text-white"
                                        : "text-foreground/80 hover:text-primary"
                                    }`}
                                  >
                                    {product.name}
                                  </Link>
                                ))
                              : category.items.slice(0, 3).map((item) => (
                                  <div
                                    key={item}
                                    className={
                                      useHeroNavbar
                                        ? "text-sm text-white/72"
                                        : "text-sm text-foreground/75"
                                    }
                                  >
                                    {item}
                                  </div>
                                ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {links.slice(2).map((l) => (
                <Link key={l.to} to={l.to} className={mobileLinkClassName}>
                  {l.label}
                </Link>
              ))}

              <Link
                to="/contact"
                className="mt-2 rounded-lg gradient-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
