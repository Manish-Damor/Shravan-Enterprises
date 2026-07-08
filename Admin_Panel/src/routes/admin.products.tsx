import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MediaDropzone, type MediaValue } from "@/components/admin/media-dropzone";
import { RepeatableEditor, type RepeatableRow } from "@/components/admin/repeatable-editor";
import { Eye, EyeOff, ImageIcon, Package2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({ component: ProductsPage });

type Category = {
  id: string;
  name: string;
  slug?: string;
};

type ProductDocument = {
  id: string;
  name?: string;
  slug?: string | null;
  category_id?: string | null;
  subtitle?: string | null;
  short_description?: string | null;
  detailed_description?: string | null;
  status?: "draft" | "published";
  featured?: boolean;
  sort_order?: number;
  image?: MediaValue | null;
  gallery_images?: MediaValue[];
  applications?: string | null;
  application_rows?: RepeatableRow[];
  key_features?: string | null;
  characteristics?: string | null;
  technical_specifications?: string | null;
  specification_rows?: RepeatableRow[];
  industries_served?: string | null;
  unit_of_measurement?: string | null;
  moq?: string | null;
  available_packing_size?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  category_id: string | null;
  subtitle: string;
  short_description: string;
  detailed_description: string;
  status: "draft" | "published";
  featured: boolean;
  sort_order: number;
  image: MediaValue | null;
  gallery_images: MediaValue[];
  applications: string;
  application_rows: RepeatableRow[];
  key_features: string;
  characteristics: string;
  technical_specifications: string;
  specification_rows: RepeatableRow[];
  industries_served: string;
  unit_of_measurement: string;
  moq: string;
  available_packing_size: string;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  category_id: null,
  subtitle: "",
  short_description: "",
  detailed_description: "",
  status: "draft",
  featured: false,
  sort_order: 0,
  image: null,
  gallery_images: [],
  applications: "",
  application_rows: [],
  key_features: "",
  characteristics: "",
  technical_specifications: "",
  specification_rows: [],
  industries_served: "",
  unit_of_measurement: "",
  moq: "",
  available_packing_size: "",
};

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function ProductsPage() {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [viewing, setViewing] = useState<ProductDocument | null>(null);
  const [toDelete, setToDelete] = useState<ProductDocument | null>(null);
  const { query, configure } = useAdminSearch();

  useEffect(() => {
    configure({
      enabled: true,
      placeholder: "Search products by name, type, or short line",
    });
  }, [configure]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => apiFetch<Category[]>("/api/categories"),
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => apiFetch<ProductDocument[]>("/api/products"),
  });

  const filteredProducts = products.filter((product) => {
    const normalizedQuery = query.trim().toLowerCase();
    const categoryMatch = categoryFilter === "all" || product.category_id === categoryFilter;
    const statusMatch = statusFilter === "all" || (product.status ?? "draft") === statusFilter;
    const textMatch =
      !normalizedQuery ||
      (product.name ?? "").toLowerCase().includes(normalizedQuery) ||
      (product.subtitle ?? "").toLowerCase().includes(normalizedQuery) ||
      (product.characteristics ?? "").toLowerCase().includes(normalizedQuery) ||
      (product.short_description ?? "").toLowerCase().includes(normalizedQuery);

    return categoryMatch && statusMatch && textMatch;
  });

  const saveProduct = useMutation({
    mutationFn: async (form: ProductForm) => {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        category_id: form.category_id,
        subtitle: form.subtitle,
        short_description: form.short_description,
        detailed_description: form.detailed_description,
        status: form.status,
        featured: form.featured,
        sort_order: form.sort_order,
        image: form.image,
        gallery_images: form.gallery_images,
        applications: form.applications,
        application_rows: form.application_rows,
        key_features: form.key_features,
        characteristics: form.characteristics,
        technical_specifications: form.technical_specifications,
        specification_rows: form.specification_rows,
        industries_served: form.industries_served,
        unit_of_measurement: form.unit_of_measurement,
        moq: form.moq,
        available_packing_size: form.available_packing_size,
      };

      if (form.id) {
        await apiFetch(`/api/products/${form.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        return;
      }

      await apiFetch("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      setOpen(false);
      setEditing(null);
      toast.success("Product saved");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeProduct = useMutation({
    mutationFn: async (id: string) => apiFetch(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Product deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleStatus = useMutation({
    mutationFn: async (product: ProductDocument) => {
      await apiFetch(`/api/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: (product.status ?? "draft") === "published" ? "draft" : "published",
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const openEditor = (product?: ProductDocument) => {
    setEditing(product ? normalizeToForm(product) : { ...emptyForm });
    setOpen(true);
  };

  const handleEditorOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Package2 className="h-3.5 w-3.5" /> Product Entry
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Simple product manager
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Keep product entry clean for non-technical users. Add only the main
            product details, applications, features, technical rows, one main image,
            and multiple product images.
          </p>
        </div>

        <Button
          className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
          onClick={() => openEditor()}
        >
          <Plus className="mr-2 h-4 w-4" /> Add product
        </Button>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">
            {products.length} items
          </Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <Table className="min-w-[920px]">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type / grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                    No products match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                          {product.image?.url && product.image.type?.startsWith?.("image/") ? (
                            <img
                              src={product.image.url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-950">{product.name}</div>
                          <div className="text-xs text-slate-500">
                            {product.short_description ?? product.subtitle ?? "No short description"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {categories.find((category) => category.id === product.category_id)?.name ?? "Unassigned"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {product.characteristics ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={(product.status ?? "draft") === "published" ? "default" : "secondary"}
                          className="rounded-full"
                        >
                          {product.status ?? "draft"}
                        </Badge>
                        {product.featured ? (
                          <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            Featured
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => toggleStatus.mutate(product)}
                        >
                          {(product.status ?? "draft") === "published" ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setViewing(product)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl"
                          onClick={() => openEditor(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setToDelete(product)}
                        >
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </Card>

      {editing ? (
        <ProductEditorDialog
          open={open}
          onOpenChange={handleEditorOpenChange}
          form={editing}
          categories={categories}
          onChange={setEditing}
          onSave={() => saveProduct.mutate(editing)}
          saving={saveProduct.isPending}
        />
      ) : null}

      <Dialog open={!!viewing} onOpenChange={(state) => !state && setViewing(null)}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-[1.75rem] bg-slate-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-slate-950">
              {viewing?.name ?? "Product details"}
            </DialogTitle>
          </DialogHeader>
          {viewing ? (
            <ProductViewDialogContent
              product={viewing}
              categoryName={categories.find((category) => category.id === viewing.category_id)?.name ?? "Unassigned"}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(state) => !state && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) {
                  removeProduct.mutate(toDelete.id);
                }
                setToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function normalizeToForm(product: ProductDocument): ProductForm {
  return {
    id: product.id,
    name: product.name ?? "",
    slug: product.slug ?? "",
    category_id: product.category_id ?? null,
    subtitle: product.subtitle ?? "",
    short_description: product.short_description ?? "",
    detailed_description: product.detailed_description ?? "",
    status: product.status ?? "draft",
    featured: product.featured ?? false,
    sort_order: product.sort_order ?? 0,
    image: product.image ?? null,
    gallery_images: product.gallery_images ?? [],
    applications: product.applications ?? "",
    application_rows: product.application_rows ?? [],
    key_features: product.key_features ?? "",
    characteristics: product.characteristics ?? "",
    technical_specifications: product.technical_specifications ?? "",
    specification_rows: product.specification_rows ?? [],
    industries_served: product.industries_served ?? "",
    unit_of_measurement: product.unit_of_measurement ?? "",
    moq: product.moq ?? "",
    available_packing_size: product.available_packing_size ?? "",
  };
}

function ProductViewDialogContent({
  product,
  categoryName,
}: {
  product: ProductDocument;
  categoryName: string;
}) {
  const mediaItems = [product.image, ...(product.gallery_images ?? [])].filter(Boolean) as MediaValue[];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <SectionCard
        title="Product overview"
        description="Read-only product information for quick review."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-slate-950 text-white hover:bg-slate-950">{product.status ?? "draft"}</Badge>
            <Badge variant="secondary" className="rounded-full">{categoryName}</Badge>
            <Badge variant="secondary" className="rounded-full">{product.characteristics ?? "No type / grade"}</Badge>
            {product.featured ? <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Featured</Badge> : null}
          </div>
          <ReadOnlyField label="Slug" value={product.slug} />
          <ReadOnlyField label="Short line" value={product.subtitle} />
          <ReadOnlyField label="Short description" value={product.short_description} multiline />
          <ReadOnlyField label="Detailed description" value={product.detailed_description} multiline />
          <ReadOnlyField label="Applications summary" value={product.applications} multiline />
          <ReadOnlyField label="Industries served" value={product.industries_served} multiline />
          <ReadOnlyField label="Key features" value={product.key_features} multiline />
          <ReadOnlyField label="Technical summary" value={product.technical_specifications} multiline />
        </div>
      </SectionCard>

      <SectionCard
        title="Commercial details"
        description="Operational values and media preview."
      >
        <div className="space-y-4">
          <ReadOnlyField label="Unit of measurement" value={product.unit_of_measurement} />
          <ReadOnlyField label="MOQ" value={product.moq} />
          <ReadOnlyField label="Packing size" value={product.available_packing_size} />
          <ReadOnlyField label="Sort order" value={String(product.sort_order ?? 0)} />
          <ReadOnlyField label="Created" value={product.createdAt ? new Date(product.createdAt).toLocaleString() : ""} />
          <ReadOnlyField label="Updated" value={product.updatedAt ? new Date(product.updatedAt).toLocaleString() : ""} />
          <div className="space-y-2">
            <Label className="text-slate-700">Images</Label>
            {mediaItems.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {mediaItems.map((item, index) => (
                  <div key={`${item.url}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {item.url && item.type?.startsWith?.("image/") ? (
                      <img src={item.url} alt={item.name ?? product.name ?? `Product image ${index + 1}`} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-sm text-slate-500">No preview</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No images added.</div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Application rows"
        description="Structured usage details entered for this product."
        className="xl:col-span-2"
      >
        <RepeatableRowsPreview
          rows={product.application_rows}
          emptyLabel="No application rows added."
          columns={["title", "description"]}
        />
      </SectionCard>

      <SectionCard
        title="Technical data rows"
        description="Structured technical properties entered for this product."
        className="xl:col-span-2"
      >
        <RepeatableRowsPreview
          rows={product.specification_rows}
          emptyLabel="No technical rows added."
          columns={["property", "value", "unit", "notes"]}
        />
      </SectionCard>
    </div>
  );
}

function ProductEditorDialog({
  open,
  onOpenChange,
  form,
  categories,
  onChange,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ProductForm;
  categories: Category[];
  onChange: (form: ProductForm) => void;
  onSave: () => void;
  saving: boolean;
}) {
  useEffect(() => {
    if (!form.slug && form.name.trim()) {
      onChange({ ...form, slug: slugify(form.name) });
    }
  }, [form, onChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-7xl overflow-y-auto rounded-[1.75rem] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-950">
            {form.id ? "Edit product" : "Add product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 xl:grid-cols-2">
          <SectionCard
            title="Main details"
            description="Only the essential identity fields your admin team needs every time."
            className="min-h-[340px]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Product name" required>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    onChange({
                      ...form,
                      name: event.target.value,
                      slug: slugify(event.target.value),
                    })
                  }
                />
              </Field>

              <Field label="Slug">
                <Input
                  value={form.slug}
                  onChange={(event) => onChange({ ...form, slug: slugify(event.target.value) })}
                />
              </Field>

              <Field label="Category" required>
                <Select
                  value={form.category_id ?? "none"}
                  onValueChange={(value) =>
                    onChange({ ...form, category_id: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Type / grade">
                <Input
                  value={form.characteristics}
                  onChange={(event) => onChange({ ...form, characteristics: event.target.value })}
                  placeholder="Example: High Molecular Flocculent / A Grade / 180 GSM"
                />
              </Field>

              <Field label="Short line" className="md:col-span-2">
                <Input
                  value={form.subtitle}
                  onChange={(event) => onChange({ ...form, subtitle: event.target.value })}
                  placeholder="Short line shown under the product name"
                />
              </Field>

              <Field label="Short description" className="md:col-span-2">
                <Textarea
                  rows={3}
                  value={form.short_description}
                  onChange={(event) => onChange({ ...form, short_description: event.target.value })}
                  placeholder="Simple overview for the product card or quick summary"
                />
              </Field>

              <Field label="Detailed description" className="md:col-span-2">
                <Textarea
                  rows={5}
                  value={form.detailed_description}
                  onChange={(event) => onChange({ ...form, detailed_description: event.target.value })}
                  placeholder="Full product explanation based on your product sheet"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Publish settings"
            description="Keep the right side stable with the same panel size for every product."
            className="min-h-[340px]"
          >
            <div className="flex h-full flex-col gap-5">
              <MediaDropzone
                label="Main product image"
                value={form.image}
                accept="image/*"
                onChange={(value) =>
                  onChange({
                    ...form,
                    image: Array.isArray(value) ? value[0] ?? null : value,
                  })
                }
              />
              <MediaDropzone
                label="Product gallery images"
                value={form.gallery_images}
                accept="image/*"
                multiple
                onChange={(value) =>
                  onChange({
                    ...form,
                    gallery_images: Array.isArray(value) ? value : value ? [value] : [],
                  })
                }
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Status">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={form.status === "draft" ? "default" : "outline"}
                      onClick={() => onChange({ ...form, status: "draft" })}
                    >
                      Draft
                    </Button>
                    <Button
                      type="button"
                      variant={form.status === "published" ? "default" : "outline"}
                      onClick={() => onChange({ ...form, status: "published" })}
                    >
                      Published
                    </Button>
                  </div>
                </Field>

                <Field label="Featured">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={form.featured ? "default" : "outline"}
                      onClick={() => onChange({ ...form, featured: true })}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={!form.featured ? "default" : "outline"}
                      onClick={() => onChange({ ...form, featured: false })}
                    >
                      No
                    </Button>
                  </div>
                </Field>

                <Field label="Sort order">
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={(event) =>
                      onChange({
                        ...form,
                        sort_order: Number(event.target.value || 0),
                      })
                    }
                  />
                </Field>

                <Field label="Unit">
                  <Input
                    value={form.unit_of_measurement}
                    onChange={(event) =>
                      onChange({ ...form, unit_of_measurement: event.target.value })
                    }
                    placeholder="KG / LTR / PCS / BAG"
                  />
                </Field>

                <Field label="MOQ">
                  <Input
                    value={form.moq}
                    onChange={(event) => onChange({ ...form, moq: event.target.value })}
                    placeholder="Minimum order quantity"
                  />
                </Field>

                <Field label="Packing size">
                  <Input
                    value={form.available_packing_size}
                    onChange={(event) =>
                      onChange({ ...form, available_packing_size: event.target.value })
                    }
                    placeholder="25 KG / 50 KG / 200 LTR"
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Applications and industries"
            description="Use one simple text area or add rows when a product has multiple applications."
            className="min-h-[360px]"
          >
            <div className="space-y-4">
              <Field label="Applications summary">
                <Textarea
                  rows={4}
                  value={form.applications}
                  onChange={(event) => onChange({ ...form, applications: event.target.value })}
                  placeholder="Example: River water treatment, waste water clarification, textile industry"
                />
              </Field>

              <Field label="Industries served">
                <Textarea
                  rows={4}
                  value={form.industries_served}
                  onChange={(event) => onChange({ ...form, industries_served: event.target.value })}
                  placeholder="Example: Marble industry, water treatment industry, textile industry"
                />
              </Field>

              <RepeatableEditor
                title="Application rows"
                columns={[
                  { key: "title", label: "Application / industry", placeholder: "Waste water clarification" },
                  { key: "description", label: "Note", placeholder: "Optional note", textarea: true },
                ]}
                rows={form.application_rows}
                onChange={(rows) => onChange({ ...form, application_rows: rows })}
                dense
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Features and technical details"
            description="Keep product strengths and technical values in one stable area."
            className="min-h-[360px]"
          >
            <div className="space-y-4">
              <Field label="Key features">
                <Textarea
                  rows={4}
                  value={form.key_features}
                  onChange={(event) => onChange({ ...form, key_features: event.target.value })}
                  placeholder="Example: Excellent flocculation, low dosage, strong sludge dewatering"
                />
              </Field>

              <Field label="Technical summary">
                <Textarea
                  rows={4}
                  value={form.technical_specifications}
                  onChange={(event) =>
                    onChange({ ...form, technical_specifications: event.target.value })
                  }
                  placeholder="Short technical notes if you do not want to enter rows"
                />
              </Field>

              <RepeatableEditor
                title="Technical data rows"
                columns={[
                  { key: "property", label: "Property", placeholder: "Surface Area" },
                  { key: "value", label: "Value", placeholder: "130 +/- 20" },
                  { key: "unit", label: "Unit", placeholder: "m2/g" },
                  { key: "notes", label: "Note", placeholder: "Optional note", textarea: true },
                ]}
                rows={form.specification_rows}
                onChange={(rows) => onChange({ ...form, specification_rows: rows })}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Quick preview"
            description="Simple review block before saving. Panel height remains consistent."
            className="xl:col-span-2 min-h-[260px]"
          >
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Product summary
                </div>
                <h3 className="mt-3 text-2xl font-semibold">
                  {form.name || "Product name"}
                </h3>
                <div className="mt-2 text-sm text-slate-300">
                  {form.subtitle || form.short_description || "Short line or summary"}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                    {categories.find((category) => category.id === form.category_id)?.name ?? "No category"}
                  </Badge>
                  <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                    {form.characteristics || "No type"}
                  </Badge>
                  <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                    {form.status}
                  </Badge>
                  <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                    {(form.image ? 1 : 0) + form.gallery_images.length} image
                    {(form.image ? 1 : 0) + form.gallery_images.length === 1 ? "" : "s"}
                  </Badge>
                  {form.featured ? (
                    <Badge className="rounded-full bg-emerald-400/20 text-emerald-200 hover:bg-emerald-400/20">
                      Featured
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Ready to save
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    This screen is now limited to practical product entry only.
                    No SEO tab, no bulk table, and no extra media/document clutter.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                    onClick={onSave}
                    disabled={saving || !form.name.trim()}
                  >
                    {saving ? "Saving..." : "Save product"}
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionCard({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={`rounded-[1.5rem] border-slate-200 bg-white p-5 shadow-sm ${className ?? ""}`}>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </Card>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label className="text-slate-700">
        {label} {required ? "*" : ""}
      </Label>
      {children}
    </div>
  );
}

function ReadOnlyField({
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
      <div className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 ${multiline ? "min-h-20 whitespace-pre-wrap" : ""}`}>
        {value?.trim() ? value : "Not provided"}
      </div>
    </div>
  );
}

function RepeatableRowsPreview({
  rows,
  columns,
  emptyLabel,
}: {
  rows?: RepeatableRow[];
  columns: string[];
  emptyLabel: string;
}) {
  if (!rows?.length) {
    return <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{emptyLabel}</div>;
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={row.id ?? index} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Row {index + 1}</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((column) => (
              <div key={column}>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{column}</div>
                <div className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">
                  {String((row as Record<string, unknown>)[column] ?? "").trim() || "Not provided"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
