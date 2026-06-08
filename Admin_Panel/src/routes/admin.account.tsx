import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaDropzone, type MediaValue } from "@/components/admin/media-dropzone";
import { Plus, Settings2, Globe, Users, Phone, Mail, Building2, FileBadge2, Landmark, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/account")({ component: AccountPage });

type SiteSetting = {
  id: string;
  scope: string;
  company_name?: string;
  logo?: MediaValue | null;
  about?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  gst?: string;
  msme?: string;
  pan?: string;
  footer?: string;
  social?: { facebook?: string; instagram?: string; linkedin?: string; youtube?: string; website?: string };
  createdAt?: string;
  updatedAt?: string;
};

type Banner = { id: string; title?: string; subtitle?: string; image?: MediaValue | null; link?: string; sort_order?: number };
type Client = { id: string; name?: string; logo?: MediaValue | null; sort_order?: number };

function AccountPage() {
  const { user, updateAccount } = useAuth();
  const qc = useQueryClient();
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: settings = [] } = useQuery({ queryKey: ["website-settings"], queryFn: async () => apiFetch<SiteSetting[]>("/api/website-settings") });
  const { data: banners = [] } = useQuery({ queryKey: ["banners"], queryFn: async () => apiFetch<Banner[]>("/api/banners") });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: async () => apiFetch<Client[]>("/api/clients") });

  const globalSetting = useMemo(() => settings.find((setting) => setting.scope === "global") ?? null, [settings]);
  const [site, setSite] = useState<SiteSetting>({ id: "", scope: "global" });

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (globalSetting) {
      setSite(globalSetting);
    }
  }, [globalSetting]);

  const saveAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await updateAccount({ email, phone, password: password || undefined });
      setPassword("");
      toast.success("Account credentials updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update account");
    } finally {
      setLoading(false);
    }
  };

  const saveSite = useMutation({
    mutationFn: async () => {
      if (site.id) {
        await apiFetch(`/api/website-settings/${site.id}`, { method: "PUT", body: JSON.stringify(site) });
      } else {
        await apiFetch("/api/website-settings", { method: "POST", body: JSON.stringify(site) });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website-settings"] });
      toast.success("Website settings saved");
    },
  });

  const addBanner = useMutation({
    mutationFn: async () => apiFetch("/api/banners", { method: "POST", body: JSON.stringify({ title: "New banner", subtitle: "Homepage banner", sort_order: banners.length + 1 }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner added");
    },
  });

  const addClient = useMutation({
    mutationFn: async () => apiFetch("/api/clients", { method: "POST", body: JSON.stringify({ name: "New client", sort_order: clients.length + 1 }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client added");
    },
  });

  const saveBanner = useMutation({
    mutationFn: async (banner: Banner) => apiFetch(`/api/banners/${banner.id}`, { method: "PUT", body: JSON.stringify(banner) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner updated");
    },
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => apiFetch(`/api/banners/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner deleted");
    },
  });

  const saveClient = useMutation({
    mutationFn: async (client: Client) => apiFetch(`/api/clients/${client.id}`, { method: "PUT", body: JSON.stringify(client) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client updated");
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => apiFetch(`/api/clients/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <Settings2 className="h-3.5 w-3.5" /> Content & settings
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Account, content control, and website settings</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Manage admin login credentials and the company content that appears across the public site.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-3xl bg-transparent p-0 md:grid-cols-3">
          <TabsTrigger value="account">Admin account</TabsTrigger>
          <TabsTrigger value="site">Company settings</TabsTrigger>
          <TabsTrigger value="content">Banners & clients</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-5">
          <Card className="rounded-[1.75rem] border-slate-200 bg-white p-6 shadow-sm max-w-3xl">
            <form onSubmit={saveAccount} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} type="email" onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} type="tel" onChange={(event) => setPhone(event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>New password</Label>
                <Input value={password} type="password" onChange={(event) => setPassword(event.target.value)} placeholder="Leave blank to keep current password" />
              </div>
              <Button type="submit" className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" disabled={loading}>
                Save account
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="site" className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <Card className="rounded-[1.75rem] border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Company name"><Input value={site.company_name ?? ""} onChange={(event) => setSite({ ...site, company_name: event.target.value })} /></Field>
              <Field label="Contact email"><Input value={site.contact_email ?? ""} onChange={(event) => setSite({ ...site, contact_email: event.target.value })} /></Field>
              <Field label="Contact phone"><Input value={site.contact_phone ?? ""} onChange={(event) => setSite({ ...site, contact_phone: event.target.value })} /></Field>
              <Field label="GST number"><Input value={site.gst ?? ""} onChange={(event) => setSite({ ...site, gst: event.target.value })} /></Field>
              <Field label="MSME number"><Input value={site.msme ?? ""} onChange={(event) => setSite({ ...site, msme: event.target.value })} /></Field>
              <Field label="PAN number"><Input value={site.pan ?? ""} onChange={(event) => setSite({ ...site, pan: event.target.value })} /></Field>
              <Field label="Address" className="md:col-span-2"><Textarea rows={3} value={site.address ?? ""} onChange={(event) => setSite({ ...site, address: event.target.value })} /></Field>
              <Field label="About company" className="md:col-span-2"><Textarea rows={5} value={site.about ?? ""} onChange={(event) => setSite({ ...site, about: event.target.value })} /></Field>
              <Field label="Footer content" className="md:col-span-2"><Textarea rows={4} value={site.footer ?? ""} onChange={(event) => setSite({ ...site, footer: event.target.value })} /></Field>
              <Field label="Facebook"><Input value={site.social?.facebook ?? ""} onChange={(event) => setSite({ ...site, social: { ...(site.social ?? {}), facebook: event.target.value } })} /></Field>
              <Field label="Instagram"><Input value={site.social?.instagram ?? ""} onChange={(event) => setSite({ ...site, social: { ...(site.social ?? {}), instagram: event.target.value } })} /></Field>
              <Field label="LinkedIn"><Input value={site.social?.linkedin ?? ""} onChange={(event) => setSite({ ...site, social: { ...(site.social ?? {}), linkedin: event.target.value } })} /></Field>
              <Field label="Website"><Input value={site.social?.website ?? ""} onChange={(event) => setSite({ ...site, social: { ...(site.social ?? {}), website: event.target.value } })} /></Field>
            </div>
            <div className="mt-5">
              <MediaDropzone label="Company logo" value={site.logo ?? null} accept="image/*" onChange={(value) => setSite({ ...site, logo: Array.isArray(value) ? value[0] ?? null : value })} />
            </div>
            <div className="mt-5 flex justify-end">
              <Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => saveSite.mutate()}>
                Save company settings
              </Button>
            </div>
          </Card>

          <Card className="rounded-[1.75rem] border-slate-200 bg-slate-950 p-6 text-white shadow-lg shadow-slate-950/10">
            <div className="text-sm font-semibold">Content snapshot</div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-sky-300" /> {site.company_name || "Company name"}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-300" /> {site.contact_email || "Contact email"}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber-300" /> {site.contact_phone || "Contact phone"}</div>
              <div className="flex items-center gap-2"><Landmark className="h-4 w-4 text-violet-300" /> {site.gst || "GST pending"}</div>
              <div className="flex items-center gap-2"><FileBadge2 className="h-4 w-4 text-rose-300" /> {site.pan || "PAN pending"}</div>
              <div className="flex items-start gap-2"><Globe className="mt-0.5 h-4 w-4 text-cyan-300" /> {site.about || "About content goes here."}</div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-5 grid gap-5 xl:grid-cols-2">
          <Card className="rounded-[1.75rem] border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">Homepage banners</div>
                <div className="text-sm text-slate-500">Manage hero and category section banners</div>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={() => addBanner.mutate()}><Plus className="mr-2 h-4 w-4" /> Add banner</Button>
            </div>
            <div className="mt-5 space-y-3">
              {banners.map((banner) => (
                <div key={banner.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={banner.title ?? ""} onChange={(event) => qc.setQueryData<Banner[]>(["banners"], (current = []) => current.map((item) => item.id === banner.id ? { ...item, title: event.target.value } : item))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input value={banner.subtitle ?? ""} onChange={(event) => qc.setQueryData<Banner[]>(["banners"], (current = []) => current.map((item) => item.id === banner.id ? { ...item, subtitle: event.target.value } : item))} />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant="outline" className="rounded-2xl" onClick={() => saveBanner.mutate(banner)}>Save</Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl" onClick={() => deleteBanner.mutate(banner.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                    </div>
                  </div>
                </div>
              ))}
              {banners.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No banners yet.</div> : null}
            </div>
          </Card>

          <Card className="rounded-[1.75rem] border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">Client list</div>
                <div className="text-sm text-slate-500">Show your trusted customer logos on the website</div>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={() => addClient.mutate()}><Plus className="mr-2 h-4 w-4" /> Add client</Button>
            </div>
            <div className="mt-5 space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                    {client.logo?.url && client.logo.type?.startsWith?.("image/") ? <img src={client.logo.url} alt={client.name} className="h-full w-full object-cover" /> : <Users className="h-4 w-4 text-slate-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Label className="mb-2 block text-slate-700">Client name</Label>
                    <Input value={client.name ?? ""} onChange={(event) => qc.setQueryData<Client[]>(["clients"], (current = []) => current.map((item) => item.id === client.id ? { ...item, name: event.target.value } : item))} />
                  </div>
                  <div className="flex items-center gap-2 self-end">
                    <Button variant="outline" className="rounded-2xl" onClick={() => saveClient.mutate(client)}>Save</Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl" onClick={() => deleteClient.mutate(client.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                  </div>
                </div>
              ))}
              {clients.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No clients yet.</div> : null}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label className="text-slate-700">{label}</Label>
      {children}
    </div>
  );
}
