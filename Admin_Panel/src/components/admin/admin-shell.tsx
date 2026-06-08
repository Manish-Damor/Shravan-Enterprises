import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Boxes,
  ChevronRight,
  ClipboardList,
  FileText,
  ImageIcon,
  Inbox,
  Layers3,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/brochure-enquiries", label: "Brochure Requests", icon: FileText },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
  { to: "/admin/account", label: "Content & Settings", icon: Settings2 },
];

export function AdminShell({ children }: { children?: ReactNode }) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeItem = useMemo(
    () => navItems.find((item) => (item.exact ? path === item.to : path.startsWith(item.to))),
    [path],
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f4f7fb_30%,#eef2f8_100%)] text-foreground">
      <div className="flex min-h-screen">
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-slate-950 text-slate-100 shadow-2xl transition-transform lg:translate-x-0 xl:w-80",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}>
          <div className="border-b border-white/10 px-5 py-5 xl:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide text-white">Industrial CMS</div>
                <div className="text-xs text-slate-400">Premium admin workspace</div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Current admin</div>
              <div className="mt-1 truncate text-sm font-medium text-white">{user?.email ?? user?.phone ?? "Signed in user"}</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">{isAdmin ? "Super Admin" : "Staff"}</Badge>
                <span className="rounded-full border border-white/10 px-2 py-1">Mongo local</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Navigation</div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = item.exact ? path === item.to : path.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                      active
                        ? "bg-white text-slate-950 shadow-lg shadow-blue-500/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active ? "text-blue-600" : "text-slate-400")} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className={cn("h-4 w-4 transition-transform", active ? "text-slate-400" : "text-slate-600 group-hover:translate-x-0.5")} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Shortcuts
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-sky-300" /> Brochure-ready product data</div>
                <div className="flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5 text-emerald-300" /> Dynamic specs and applications</div>
                <div className="flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5 text-amber-300" /> Drag-and-drop media uploads</div>
                <div className="flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5 text-violet-300" /> Live product, enquiry, and content stats</div>
              </div>
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2 bg-white/10 text-white hover:bg-white/15"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-72 xl:pl-80">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                  <Warehouse className="h-3.5 w-3.5" />
                  {activeItem?.label ?? "Admin"}
                </div>
                <div className="truncate text-sm text-slate-600">Manage products, users, enquiries, and website content from one simple workspace.</div>
              </div>

              <div className="hidden lg:block w-[300px] xl:w-[340px]">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products, categories, enquiries..."
                  className="rounded-2xl border-slate-200 bg-slate-50"
                />
              </div>

              <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Layers3 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{user?.email ?? user?.phone ?? "Admin"}</div>
                  <div className="text-xs text-slate-500">{isAdmin ? "Full access" : "Limited access"}</div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1680px]">
              {children ?? <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
