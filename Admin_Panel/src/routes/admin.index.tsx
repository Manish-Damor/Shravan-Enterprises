import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BadgeCheck, Boxes, FileText, Inbox, Plus, Sparkles, TrendingUp, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

type Product = {
  id: string;
  name?: string;
  subtitle?: string | null;
  status?: "draft" | "published";
  featured?: boolean;
  brochure_pdf?: { name: string; url: string } | null;
  tds_pdf?: { name: string; url: string } | null;
  createdAt?: string;
  updatedAt?: string;
};

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const [categories, enquiries, users, products, brochureRequests] = await Promise.all([
        apiFetch<{ count: number }>("/api/categories/count"),
        apiFetch<{ count: number }>("/api/enquiries/count"),
        apiFetch<Array<{ id: string }>>("/api/users"),
        apiFetch<Product[]>("/api/products"),
        apiFetch<{ count: number }>("/api/brochure-enquiries/count"),
      ]);

      return {
        categories: categories.count,
        enquiries: enquiries.count,
        users: users.length,
        products,
        brochureRequests: brochureRequests.count,
        totalProducts: products.length,
        totalBrochures: products.filter((product) => product.brochure_pdf?.url || product.tds_pdf?.url).length,
        published: products.filter((product) => product.status === "published").length,
        drafts: products.filter((product) => product.status !== "published").length,
        featured: products.filter((product) => Boolean(product.featured)).length,
      };
    },
  });

  const recentProducts = [...(data?.products ?? [])].sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()).slice(0, 6);
  const featuredProducts = (data?.products ?? []).filter((product) => product.featured).slice(0, 4);

  const cards = [
    { label: "Total Products", value: data?.totalProducts ?? 0, icon: Boxes, tone: "from-sky-500 to-blue-600" },
    { label: "Categories", value: data?.categories ?? 0, icon: Sparkles, tone: "from-emerald-500 to-teal-600" },
    { label: "Brochure Requests", value: data?.brochureRequests ?? 0, icon: Inbox, tone: "from-cyan-500 to-sky-600" },
    { label: "Total Enquiries", value: data?.enquiries ?? 0, icon: Inbox, tone: "from-cyan-500 to-blue-500" },
    { label: "Draft Products", value: data?.drafts ?? 0, icon: BadgeCheck, tone: "from-amber-500 to-orange-600" },
    { label: "Published Products", value: data?.published ?? 0, icon: TrendingUp, tone: "from-emerald-500 to-lime-600" },
  ];

  return (
    <div className="space-y-6 xl:space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-6 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_32%),linear-gradient(135deg,_#ffffff_0%,_#f8fbff_100%)] p-6 lg:grid-cols-[1.5fr_1fr] lg:p-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <Sparkles className="h-3.5 w-3.5" /> Industrial admin workspace
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Modern product CMS for brochures, PDFs, and industrial catalog management.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Manage FRP raw materials, resin, chemicals, water treatment, infusion, stone care, packaging, tools, safety, and brochure-style product data in one fast dashboard.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800">
                <Link to="/admin/products"><Plus className="mr-2 h-4 w-4" /> Quick add product</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl border-slate-300 px-5">
                <Link to="/admin/categories">Manage categories <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="rounded-3xl border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Featured products</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">{data?.featured ?? 0}</div>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><BadgeCheck className="h-5 w-5" /></div>
              </div>
            </Card>
            <Card className="rounded-3xl border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Website users</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">{data?.users ?? 0}</div>
                </div>
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700"><Users className="h-5 w-5" /></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="overflow-hidden rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-lg`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="mt-5 text-sm font-medium text-slate-500">{card.label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="rounded-[1.75rem] border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-950">Recent products</div>
              <div className="text-sm text-slate-500">Track the latest brochure-ready entries</div>
            </div>
            <Button asChild variant="outline" className="rounded-2xl"><Link to="/admin/products">Open products</Link></Button>
          </div>
          <div className="mt-5 space-y-3">
            {recentProducts.length > 0 ? recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white"><Boxes className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate font-medium text-slate-950">{product.name}</div>
                    <Badge variant={product.status === "published" ? "default" : "secondary"}>{product.status ?? "draft"}</Badge>
                    {product.featured ? <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Featured</Badge> : null}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm text-slate-500">{product.subtitle ?? "No subtitle yet"}</div>
                </div>
                <div className="text-xs text-slate-500">{formatDistanceToNow(new Date(product.updatedAt ?? product.createdAt ?? Date.now()), { addSuffix: true })}</div>
              </div>
            )) : <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No products added yet.</div>}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[1.75rem] border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-950">Featured products</div>
                <div className="text-sm text-slate-500">Use these on your homepage and hero sections</div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><BadgeCheck className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-950">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.status ?? "draft"}</div>
                  </div>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">No featured products yet.</div>}
            </div>
          </Card>

          <Card className="rounded-[1.75rem] border-slate-200 bg-slate-950 p-6 text-white shadow-lg shadow-slate-950/10">
            <div className="text-sm font-semibold">Recommended next steps</div>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <div>1. Add categories for each industrial product family.</div>
              <div>2. Create brochure-ready products with PDFs and technical specs.</div>
              <div>3. Publish homepage banners, content blocks, and featured items.</div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
