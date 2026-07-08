import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowDown, ArrowUp, Eye, EyeOff, FolderTree, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MediaDropzone, type MediaValue } from "@/components/admin/media-dropzone";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesPage });

type Category = {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  banner_image?: MediaValue | null;
  icon?: MediaValue | null;
  seo_title?: string | null;
  seo_description?: string | null;
  status?: "active" | "inactive";
  sort_order?: number;
  parent_id?: string | null;
  description?: string | null;
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const defaultCategories = [
  "Fiber Reinforcement",
  "Resin & Chemicals",
  "Vacuum Infusion",
  "FRP Accessories",
  "Stone Pro & Surface",
  "Water Treatment Chemicals",
  "Packing Materials",
  "Safety Items",
  "Tools & Accessories",
  "Civil & Construction Items",
];

function CategoriesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Category | null>(null);
  const [viewing, setViewing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const { query, configure } = useAdminSearch();

  useEffect(() => {
    configure({
      enabled: true,
      placeholder: "Search categories by name or slug",
    });
  }, [configure]);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => apiFetch<Category[]>('/api/categories'),
  });

  const parentMap = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);

  const save = useMutation({
    mutationFn: async (input: Partial<Category> & { id?: string }) => {
      const payload = {
        name: input.name!,
        slug: input.slug || slugify(input.name!),
        short_description: input.short_description ?? null,
        banner_image: input.banner_image ?? null,
        icon: input.icon ?? null,
        seo_title: input.seo_title ?? null,
        seo_description: input.seo_description ?? null,
        status: input.status ?? "active",
        sort_order: input.sort_order ?? 0,
        parent_id: input.parent_id ?? null,
        description: input.description ?? null,
      };
      if (input.id) {
        await apiFetch(`/api/categories/${input.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch('/api/categories', { method: "POST", body: JSON.stringify(payload) });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      setOpen(false);
      setEditing(null);
      toast.success("Category saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => apiFetch(`/api/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Category deleted");
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async (category: Category) => {
      await apiFetch(`/api/categories/${category.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: category.status === "active" ? "inactive" : "active" }),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, delta }: { id: string; delta: number }) => {
      const category = categories.find((item) => item.id === id);
      if (!category) return;
      await apiFetch(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ sort_order: (category.sort_order ?? 0) + delta }),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const filtered = categories.filter((category) => {
    const normalizedQuery = query.toLowerCase();
    return category.name.toLowerCase().includes(normalizedQuery) || category.slug.toLowerCase().includes(normalizedQuery);
  });

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <FolderTree className="h-3.5 w-3.5" /> Category Management
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Industrial product categories</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Organize the catalog by product family, parent groups, and SEO-ready landing pages.</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" /> New category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {defaultCategories.map((name) => (
          <Card key={name} className="rounded-3xl border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-slate-950">{name}</div>
            <div className="mt-1 text-xs text-slate-500">Ready for FRP, chemical, tools, and safety catalog sections.</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{categories.length} total categories</Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <Table className="min-w-[940px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Order</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-slate-500">Loading categories...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-slate-500">No categories found.</TableCell></TableRow>
              ) : filtered.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => reorder.mutate({ id: category.id, delta: -1 })}><ArrowUp className="h-3.5 w-3.5" /></Button>
                      <span className="w-5 text-center text-xs text-slate-500">{category.sort_order ?? 0}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => reorder.mutate({ id: category.id, delta: 1 })}><ArrowDown className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-950">{category.name}</div>
                    <div className="text-xs text-slate-500">{category.short_description ?? category.description ?? "No description"}</div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-500">{category.slug}</TableCell>
                  <TableCell className="text-sm text-slate-500">{category.parent_id ? parentMap.get(category.parent_id) ?? "—" : "Top level"}</TableCell>
                  <TableCell>
                    <Badge variant={category.status === "active" ? "default" : "secondary"} className="rounded-full">
                      {category.status ?? "active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleStatus.mutate(category)}>
                        {category.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setViewing(category)}>
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => { setEditing(category); setOpen(true); }}>
                        Edit
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setToDelete(category)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      </Card>

      <CategoryDialog open={open} onOpenChange={handleDialogOpenChange} editing={editing} categories={categories} onSave={(value) => save.mutate(value)} saving={save.isPending} />

      <Dialog open={!!viewing} onOpenChange={(openState) => !openState && setViewing(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-[1.75rem] bg-slate-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-slate-950">
              {viewing?.name ?? "Category details"}
            </DialogTitle>
          </DialogHeader>
          {viewing ? (
            <CategoryViewDialogContent
              category={viewing}
              parentName={viewing.parent_id ? parentMap.get(viewing.parent_id) ?? "Unknown" : "Top level"}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(openState) => !openState && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) remove.mutate(toDelete.id); setToDelete(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CategoryViewDialogContent({
  category,
  parentName,
}: {
  category: Category;
  parentName: string;
}) {
  const mediaItems = [
    { label: "Banner image", value: category.banner_image },
    { label: "Icon", value: category.icon },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[1.5rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-950">Category overview</h3>
          <p className="mt-1 text-sm text-slate-600">Read-only information for quick review before editing.</p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-slate-950 text-white hover:bg-slate-950">{category.status ?? "active"}</Badge>
            <Badge variant="secondary" className="rounded-full">{parentName}</Badge>
            <Badge variant="secondary" className="rounded-full">Sort order: {category.sort_order ?? 0}</Badge>
          </div>
          <ReadOnlyCategoryField label="Slug" value={category.slug} />
          <ReadOnlyCategoryField label="Short description" value={category.short_description} multiline />
          <ReadOnlyCategoryField label="Long description" value={category.description} multiline />
          <ReadOnlyCategoryField label="SEO title" value={category.seo_title} />
          <ReadOnlyCategoryField label="SEO description" value={category.seo_description} multiline />
        </div>
      </Card>

      <Card className="rounded-[1.5rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-950">Media preview</h3>
          <p className="mt-1 text-sm text-slate-600">Current banner and icon assigned to this category.</p>
        </div>
        <div className="space-y-4">
          {mediaItems.map((item) => (
            <div key={item.label} className="space-y-2">
              <Label className="text-slate-700">{item.label}</Label>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {item.value?.url && item.value.type?.startsWith?.("image/") ? (
                  <img src={item.value.url} alt={item.value.name ?? item.label} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center text-sm text-slate-500">No image added</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CategoryDialog({
  open,
  onOpenChange,
  editing,
  categories,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Category | null;
  categories: Category[];
  onSave: (value: Partial<Category> & { id?: string }) => void;
  saving: boolean;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [sortOrder, setSortOrder] = useState(0);
  const [parentId, setParentId] = useState<string>("none");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [bannerImage, setBannerImage] = useState<MediaValue | null>(null);
  const [icon, setIcon] = useState<MediaValue | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setSlug(editing?.slug ?? "");
    setShortDescription(editing?.short_description ?? editing?.description ?? "");
    setDescription(editing?.description ?? editing?.short_description ?? "");
    setStatus(editing?.status ?? "active");
    setSortOrder(editing?.sort_order ?? 0);
    setParentId(editing?.parent_id ?? "none");
    setSeoTitle(editing?.seo_title ?? "");
    setSeoDescription(editing?.seo_description ?? "");
    setBannerImage(editing?.banner_image ?? null);
    setIcon(editing?.icon ?? null);
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[1.75rem]">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Name *</Label>
            <Input value={name} onChange={(event) => { setName(event.target.value); if (!editing) setSlug(slugify(event.target.value)); }} placeholder="Fiber Reinforcement" />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="fiber-reinforcement" />
          </div>
          <div className="space-y-2">
            <Label>Parent category</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger><SelectValue placeholder="Top level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Top level</SelectItem>
                {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Short description</Label>
            <Textarea value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} rows={2} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Long description</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>SEO title</Label>
            <Input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>SEO description</Label>
            <Input value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2">
              <Button type="button" variant={status === "active" ? "default" : "outline"} onClick={() => setStatus("active")}>Active</Button>
              <Button type="button" variant={status === "inactive" ? "default" : "outline"} onClick={() => setStatus("inactive")}>Inactive</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} />
          </div>
          <div className="md:col-span-2">
            <MediaDropzone label="Category banner image" value={bannerImage} accept="image/*" onChange={(value) => setBannerImage(Array.isArray(value) ? value[0] ?? null : value)} />
          </div>
          <div className="md:col-span-2">
            <MediaDropzone label="Category icon" value={icon} accept="image/*" onChange={(value) => setIcon(Array.isArray(value) ? value[0] ?? null : value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            type="button"
            className="bg-slate-950 text-white hover:bg-slate-800"
            disabled={saving || !name.trim()}
            onClick={() => onSave({
              id: editing?.id,
              name,
              slug,
              short_description: shortDescription || null,
              description: description || null,
              status,
              sort_order: sortOrder,
              parent_id: parentId === "none" ? null : parentId,
              seo_title: seoTitle || null,
              seo_description: seoDescription || null,
              banner_image: bannerImage,
              icon,
            })}
          >
            Save category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReadOnlyCategoryField({
  label,
  value,
  multiline,
}: {
  label: string;
  value?: string | null;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-700">{label}</Label>
      <div className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 ${multiline ? "min-h-20 whitespace-pre-wrap" : ""}`}>
        {value?.trim() ? value : "Not provided"}
      </div>
    </div>
  );
}
