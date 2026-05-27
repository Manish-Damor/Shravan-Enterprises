import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MediaDropzone, type MediaValue } from "@/components/admin/media-dropzone";
import { RepeatableEditor, type RepeatableRow } from "@/components/admin/repeatable-editor";
import { ArrowRight, Eye, EyeOff, FileText, FlaskConical, Plus, Printer, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const Route = createFileRoute("/admin/products")({ component: ProductsPage });

type Category = { id: string; name: string; slug?: string };

type ProductDocument = {
  id: string;
  name?: string;
  subtitle?: string | null;
  code?: string | null;
  slug?: string | null;
  category_id?: string | null;
  brand?: string | null;
  manufacturer?: string | null;
  short_description?: string | null;
  detailed_description?: string | null;
  status?: "draft" | "published";
  featured?: boolean;
  sort_order?: number;
  image?: MediaValue | null;
  gallery_images?: MediaValue[];
  application_images?: MediaValue[];
  brochure_pdf?: MediaValue | null;
  tds_pdf?: MediaValue | null;
  msds_pdf?: MediaValue | null;
  certificate?: MediaValue | null;
  product_details?: string | null;
  key_features?: string | null;
  benefits?: string | null;
  applications?: string | null;
  characteristics?: string | null;
  physical_properties?: string | null;
  technical_specifications?: string | null;
  usage_instructions?: string | null;
  storage_instructions?: string | null;
  packaging_details?: string | null;
  safety_notes?: string | null;
  industries_served?: string | null;
  unit_of_measurement?: string | null;
  moq?: string | null;
  available_packing_size?: string | null;
  specification_rows?: RepeatableRow[];
  application_rows?: RepeatableRow[];
  custom_sections?: RepeatableRow[];
  bulk_rows?: RepeatableRow[];
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  canonical_url?: string | null;
  og_image?: MediaValue | null;
  contact_details?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ProductForm = Omit<ProductDocument, "id" | "createdAt" | "updatedAt"> & { id?: string };

const emptyForm: ProductForm = {
  name: "",
  subtitle: "",
  code: "",
  slug: "",
  category_id: null,
  brand: "",
  manufacturer: "",
  short_description: "",
  detailed_description: "",
  status: "draft",
  featured: false,
  sort_order: 0,
  image: null,
  gallery_images: [],
  application_images: [],
  brochure_pdf: null,
  tds_pdf: null,
  msds_pdf: null,
  certificate: null,
  product_details: "",
  key_features: "",
  benefits: "",
  applications: "",
  characteristics: "",
  physical_properties: "",
  technical_specifications: "",
  usage_instructions: "",
  storage_instructions: "",
  packaging_details: "",
  safety_notes: "",
  industries_served: "",
  unit_of_measurement: "",
  moq: "",
  available_packing_size: "",
  specification_rows: [],
  application_rows: [],
  custom_sections: [],
  bulk_rows: [],
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  canonical_url: "",
  og_image: null,
  contact_details: "",
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ProductDocument | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => apiFetch<Category[]>("/api/categories"),
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => apiFetch<ProductDocument[]>("/api/products"),
  });

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      (categoryFilter === "all" || product.category_id === categoryFilter) &&
      (statusFilter === "all" || (product.status ?? "draft") === statusFilter) &&
      ((product.name ?? "").toLowerCase().includes(query) || (product.subtitle ?? "").toLowerCase().includes(query) || (product.code ?? "").toLowerCase().includes(query))
    );
  });

  const saveProduct = useMutation({
    mutationFn: async (form: ProductForm) => {
      const payload = { ...form, slug: form.slug || slugify(form.name ?? "") };
      if (form.id) {
        await apiFetch(`/api/products/${form.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/api/products", { method: "POST", body: JSON.stringify(payload) });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      setOpen(false);
      setPreviewOpen(false);
      setEditing(null);
      toast.success("Product saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeProduct = useMutation({
    mutationFn: async (id: string) => apiFetch(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Product deleted");
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async (product: ProductDocument) => {
      await apiFetch(`/api/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: (product.status ?? "draft") === "published" ? "draft" : "published" }),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const openEditor = (product?: ProductDocument) => {
    setEditing(product ? normalizeToForm(product) : { ...emptyForm });
    setOpen(true);
  };

  const publishAllFromBulk = async (rows: RepeatableRow[]) => {
    const base = editing ?? { ...emptyForm };
    for (const row of rows) {
      const productName = String(row.product_name ?? row.name ?? "").trim();
      const payload: ProductForm = {
        ...base,
        id: undefined,
        name: productName,
        subtitle: row.application ?? base.subtitle,
        unit_of_measurement: row.uom ?? base.unit_of_measurement,
        category_id: categories.find((category) => category.name === row.category)?.id ?? base.category_id,
        short_description: row.description ?? base.short_description,
        status: (row.status as "draft" | "published") ?? "draft",
        detailed_description: row.description ?? base.detailed_description,
      };
      if (productName) {
        // eslint-disable-next-line no-await-in-loop
        await apiFetch("/api/products", { method: "POST", body: JSON.stringify({ ...payload, slug: slugify(productName) }) });
      }
    }
    qc.invalidateQueries({ queryKey: ["products"] });
    toast.success("Bulk products imported");
  };

  const generateBrochurePdf = async (form: ProductForm) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 18;

    doc.setFillColor(14, 23, 42);
    doc.rect(0, 0, pageWidth, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(form.name || "Product Brochure", 14, 14);
    doc.setFontSize(10);
    doc.text(form.subtitle || form.short_description || "Industrial product brochure", 14, 20);
    doc.setTextColor(17, 24, 39);

    if (form.image?.url && form.image.type?.startsWith?.("image/")) {
      try {
        doc.addImage(form.image.url, "JPEG", pageWidth - 58, 28, 44, 44);
      } catch {
        // ignore image errors for malformed URLs
      }
    }

    cursorY = 40;
    doc.setFontSize(13);
    doc.text("Overview", 14, cursorY);
    cursorY += 7;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(form.detailed_description || form.short_description || "", 170), 14, cursorY);

    const specs = (form.specification_rows ?? []).map((row) => [row.property ?? "", row.unit ?? "", row.value ?? "", row.notes ?? ""]);
    if (specs.length > 0) {
      autoTable(doc, {
        startY: cursorY + 22,
        head: [["Property", "Unit", "Value", "Notes"]],
        body: specs,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [15, 23, 42] },
      });
    }

    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? cursorY + 22;
    doc.setFontSize(12);
    doc.text("Applications", 14, finalY + 12);
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize((form.application_rows ?? []).map((row) => row.title ?? row.application_title ?? row.name ?? "").filter(Boolean).join(", ") || form.applications || "", 180), 14, finalY + 18);

    doc.setFontSize(12);
    doc.text("Contact", 14, finalY + 35);
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(form.contact_details || "Company contact details", 180), 14, finalY + 41);

    const fileName = `${slugify(form.name || "product")}-brochure.pdf`;
    doc.save(fileName);
    await apiFetch("/api/generated-pdfs", {
      method: "POST",
      body: JSON.stringify({
        title: `${form.name || "Product"} brochure`,
        file_name: fileName,
        product_name: form.name,
        product_id: form.id ?? null,
        createdAt: new Date().toISOString(),
      }),
    });
    qc.invalidateQueries({ queryKey: ["generated-pdfs"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <FlaskConical className="h-3.5 w-3.5" /> Product Management
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Brochure-style product manager</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">Create dynamic product pages with unlimited sections, specs, applications, media uploads, and PDF generation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => openEditor()}>
            <Plus className="mr-2 h-4 w-4" /> New product
          </Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => setBulkOpen(true)}>
            <ArrowRight className="mr-2 h-4 w-4" /> Bulk import
          </Button>
        </div>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search products by name, code, or subtitle" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{products.length} products</Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Brochure</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="py-10 text-center text-slate-500">Loading products...</TableCell></TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-10 text-center text-slate-500">No products match your filters.</TableCell></TableRow>
              ) : filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                        {product.image?.url && product.image.type?.startsWith?.("image/") ? (
                          <img src={product.image.url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-950">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.subtitle ?? product.short_description ?? "No subtitle yet"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{categories.find((category) => category.id === product.category_id)?.name ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant={(product.status ?? "draft") === "published" ? "default" : "secondary"} className="rounded-full">
                      {product.status ?? "draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{product.brochure_pdf?.url || product.tds_pdf?.url ? "Available" : "Missing"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleStatus.mutate(product)}>
                        {(product.status ?? "draft") === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(normalizeToForm(product)); setOpen(true); }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setToDelete(product)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {editing ? (
        <ProductEditorDialog
          open={open}
          onOpenChange={setOpen}
          form={editing}
          categories={categories}
          onChange={setEditing}
          onSave={() => editing && saveProduct.mutate(editing)}
          saving={saveProduct.isPending}
          onPreview={() => setPreviewOpen(true)}
          onGeneratePdf={() => editing && void generateBrochurePdf(editing)}
        />
      ) : null}

      <BulkImportDialog open={bulkOpen} onOpenChange={setBulkOpen} categories={categories} onImport={publishAllFromBulk} />

      <AlertDialog open={!!toDelete} onOpenChange={(state) => !state && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) removeProduct.mutate(toDelete.id); setToDelete(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={previewOpen && !!editing} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-[1.75rem]">
          <DialogHeader>
            <DialogTitle>Brochure preview</DialogTitle>
          </DialogHeader>
          {editing ? <BrochurePreview form={editing} categoryName={categories.find((category) => category.id === editing.category_id)?.name ?? "Unassigned"} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function normalizeToForm(product: ProductDocument): ProductForm {
  return {
    ...emptyForm,
    id: product.id,
    name: product.name ?? "",
    subtitle: product.subtitle ?? "",
    code: product.code ?? "",
    slug: product.slug ?? "",
    category_id: product.category_id ?? null,
    brand: product.brand ?? "",
    manufacturer: product.manufacturer ?? "",
    short_description: product.short_description ?? "",
    detailed_description: product.detailed_description ?? "",
    status: product.status ?? "draft",
    featured: product.featured ?? false,
    sort_order: product.sort_order ?? 0,
    image: product.image ?? null,
    gallery_images: product.gallery_images ?? [],
    application_images: product.application_images ?? [],
    brochure_pdf: product.brochure_pdf ?? null,
    tds_pdf: product.tds_pdf ?? null,
    msds_pdf: product.msds_pdf ?? null,
    certificate: product.certificate ?? null,
    product_details: product.product_details ?? "",
    key_features: product.key_features ?? "",
    benefits: product.benefits ?? "",
    applications: product.applications ?? "",
    characteristics: product.characteristics ?? "",
    physical_properties: product.physical_properties ?? "",
    technical_specifications: product.technical_specifications ?? "",
    usage_instructions: product.usage_instructions ?? "",
    storage_instructions: product.storage_instructions ?? "",
    packaging_details: product.packaging_details ?? "",
    safety_notes: product.safety_notes ?? "",
    industries_served: product.industries_served ?? "",
    unit_of_measurement: product.unit_of_measurement ?? "",
    moq: product.moq ?? "",
    available_packing_size: product.available_packing_size ?? "",
    specification_rows: product.specification_rows ?? [],
    application_rows: product.application_rows ?? [],
    custom_sections: product.custom_sections ?? [],
    bulk_rows: product.bulk_rows ?? [],
    seo_title: product.seo_title ?? "",
    seo_description: product.seo_description ?? "",
    seo_keywords: product.seo_keywords ?? "",
    canonical_url: product.canonical_url ?? "",
    og_image: product.og_image ?? null,
    contact_details: product.contact_details ?? "",
  };
}

function ProductEditorDialog({
  open,
  onOpenChange,
  form,
  categories,
  onChange,
  onSave,
  saving,
  onPreview,
  onGeneratePdf,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ProductForm;
  categories: Category[];
  onChange: (form: ProductForm) => void;
  onSave: () => void;
  saving: boolean;
  onPreview: () => void;
  onGeneratePdf: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-[1600px] overflow-y-auto rounded-[1.75rem]">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit product" : "New product"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 xl:grid-cols-8">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="bulk">Bulk table</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-5 grid gap-5 xl:grid-cols-2">
            <Field label="Product name" required><Input value={form.name ?? ""} onChange={(event) => onChange({ ...form, name: event.target.value, slug: form.slug || slugify(event.target.value) })} /></Field>
            <Field label="Product subtitle / tagline"><Input value={form.subtitle ?? ""} onChange={(event) => onChange({ ...form, subtitle: event.target.value })} /></Field>
            <Field label="Product code / model number"><Input value={form.code ?? ""} onChange={(event) => onChange({ ...form, code: event.target.value })} /></Field>
            <Field label="Category">
              <Select value={form.category_id ?? "none"} onValueChange={(value) => onChange({ ...form, category_id: value === "none" ? null : value })}>
                <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Brand / manufacturer"><Input value={form.brand ?? ""} onChange={(event) => onChange({ ...form, brand: event.target.value })} /></Field>
            <Field label="Short description" className="xl:col-span-2"><Textarea rows={3} value={form.short_description ?? ""} onChange={(event) => onChange({ ...form, short_description: event.target.value })} /></Field>
            <Field label="Detailed description" className="xl:col-span-2"><Textarea rows={5} value={form.detailed_description ?? ""} onChange={(event) => onChange({ ...form, detailed_description: event.target.value })} /></Field>
            <Field label="Product status"><div className="flex gap-2"><Button type="button" variant={form.status === "draft" ? "default" : "outline"} onClick={() => onChange({ ...form, status: "draft" })}>Draft</Button><Button type="button" variant={form.status === "published" ? "default" : "outline"} onClick={() => onChange({ ...form, status: "published" })}>Published</Button></div></Field>
            <Field label="Featured"><div className="flex gap-2"><Button type="button" variant={form.featured ? "default" : "outline"} onClick={() => onChange({ ...form, featured: true })}>Yes</Button><Button type="button" variant={!form.featured ? "default" : "outline"} onClick={() => onChange({ ...form, featured: false })}>No</Button></div></Field>
            <Field label="Sort order"><Input type="number" value={form.sort_order ?? 0} onChange={(event) => onChange({ ...form, sort_order: Number(event.target.value) })} /></Field>
          </TabsContent>

          <TabsContent value="media" className="mt-5 grid gap-5 xl:grid-cols-2">
            <MediaDropzone label="Main product image" value={form.image ?? null} accept="image/*" onChange={(value) => onChange({ ...form, image: Array.isArray(value) ? value[0] ?? null : value })} />
            <MediaDropzone label="Gallery images" value={form.gallery_images ?? []} accept="image/*" multiple onChange={(value) => onChange({ ...form, gallery_images: Array.isArray(value) ? value : value ? [value] : [] })} />
            <MediaDropzone label="Application images" value={form.application_images ?? []} accept="image/*" multiple onChange={(value) => onChange({ ...form, application_images: Array.isArray(value) ? value : value ? [value] : [] })} />
            <MediaDropzone label="Brochure PDF" value={form.brochure_pdf ?? null} accept="application/pdf" onChange={(value) => onChange({ ...form, brochure_pdf: Array.isArray(value) ? value[0] ?? null : value })} />
            <MediaDropzone label="TDS PDF" value={form.tds_pdf ?? null} accept="application/pdf" onChange={(value) => onChange({ ...form, tds_pdf: Array.isArray(value) ? value[0] ?? null : value })} />
            <MediaDropzone label="MSDS PDF" value={form.msds_pdf ?? null} accept="application/pdf" onChange={(value) => onChange({ ...form, msds_pdf: Array.isArray(value) ? value[0] ?? null : value })} />
            <MediaDropzone label="Certificate" value={form.certificate ?? null} accept="application/pdf,image/*" onChange={(value) => onChange({ ...form, certificate: Array.isArray(value) ? value[0] ?? null : value })} />
            <MediaDropzone label="Open Graph image" value={form.og_image ?? null} accept="image/*" onChange={(value) => onChange({ ...form, og_image: Array.isArray(value) ? value[0] ?? null : value })} />
          </TabsContent>

          <TabsContent value="content" className="mt-5 grid gap-5 xl:grid-cols-2">
            <Field label="Product details" className="xl:col-span-2"><Textarea rows={4} value={form.product_details ?? ""} onChange={(event) => onChange({ ...form, product_details: event.target.value })} /></Field>
            <Field label="Key features"><Textarea rows={4} value={form.key_features ?? ""} onChange={(event) => onChange({ ...form, key_features: event.target.value })} /></Field>
            <Field label="Benefits"><Textarea rows={4} value={form.benefits ?? ""} onChange={(event) => onChange({ ...form, benefits: event.target.value })} /></Field>
            <Field label="Applications"><Textarea rows={4} value={form.applications ?? ""} onChange={(event) => onChange({ ...form, applications: event.target.value })} /></Field>
            <Field label="Characteristics"><Textarea rows={4} value={form.characteristics ?? ""} onChange={(event) => onChange({ ...form, characteristics: event.target.value })} /></Field>
            <Field label="Physical properties"><Textarea rows={4} value={form.physical_properties ?? ""} onChange={(event) => onChange({ ...form, physical_properties: event.target.value })} /></Field>
            <Field label="Usage instructions"><Textarea rows={4} value={form.usage_instructions ?? ""} onChange={(event) => onChange({ ...form, usage_instructions: event.target.value })} /></Field>
            <Field label="Storage instructions"><Textarea rows={4} value={form.storage_instructions ?? ""} onChange={(event) => onChange({ ...form, storage_instructions: event.target.value })} /></Field>
            <Field label="Packaging details"><Textarea rows={4} value={form.packaging_details ?? ""} onChange={(event) => onChange({ ...form, packaging_details: event.target.value })} /></Field>
            <Field label="Safety notes"><Textarea rows={4} value={form.safety_notes ?? ""} onChange={(event) => onChange({ ...form, safety_notes: event.target.value })} /></Field>
            <Field label="Industries served"><Textarea rows={4} value={form.industries_served ?? ""} onChange={(event) => onChange({ ...form, industries_served: event.target.value })} /></Field>
            <Field label="Contact details" className="xl:col-span-2"><Textarea rows={3} value={form.contact_details ?? ""} onChange={(event) => onChange({ ...form, contact_details: event.target.value })} /></Field>
            <Field label="Unit of measurement"><Input value={form.unit_of_measurement ?? ""} onChange={(event) => onChange({ ...form, unit_of_measurement: event.target.value })} /></Field>
            <Field label="MOQ"><Input value={form.moq ?? ""} onChange={(event) => onChange({ ...form, moq: event.target.value })} /></Field>
            <Field label="Available packing size"><Input value={form.available_packing_size ?? ""} onChange={(event) => onChange({ ...form, available_packing_size: event.target.value })} /></Field>
          </TabsContent>

          <TabsContent value="specs" className="mt-5 space-y-5">
            <RepeatableEditor
              title="Dynamic specification table"
              columns={[
                { key: "property", label: "Property name", placeholder: "Specific Surface Area" },
                { key: "unit", label: "Unit", placeholder: "m²/g" },
                { key: "value", label: "Value", placeholder: "130 ± 20" },
                { key: "notes", label: "Notes", placeholder: "Tested value", textarea: true },
              ]}
              rows={form.specification_rows ?? []}
              onChange={(rows) => onChange({ ...form, specification_rows: rows })}
            />
            <RepeatableEditor
              title="Dynamic custom sections"
              dense
              columns={[
                { key: "title", label: "Section title", placeholder: "Physical properties" },
                { key: "content", label: "Section content", placeholder: "Enter details for the section", textarea: true },
              ]}
              rows={form.custom_sections ?? []}
              onChange={(rows) => onChange({ ...form, custom_sections: rows })}
            />
          </TabsContent>

          <TabsContent value="applications" className="mt-5 space-y-5">
            <RepeatableEditor
              title="Dynamic application builder"
              columns={[
                { key: "title", label: "Application title", placeholder: "Water treatment" },
                { key: "description", label: "Application description", placeholder: "Describe the use case", textarea: true },
                { key: "icon", label: "Application icon/image", placeholder: "Icon URL or asset name" },
                { key: "sort_order", label: "Sort order", placeholder: "1" },
              ]}
              rows={form.application_rows ?? []}
              onChange={(rows) => onChange({ ...form, application_rows: rows })}
            />
          </TabsContent>

          <TabsContent value="bulk" className="mt-5 space-y-5">
            <RepeatableEditor
              title="Product list import"
              columns={[
                { key: "product_name", label: "Product name", placeholder: "ROVING 2400 TEX" },
                { key: "application", label: "Application", placeholder: "Vacuum infusion" },
                { key: "uom", label: "Unit of measurement", placeholder: "KG" },
                { key: "category", label: "Category", placeholder: "Fiber Reinforcement" },
                { key: "description", label: "Description", placeholder: "Imported from PDF list", textarea: true },
                { key: "status", label: "Status", placeholder: "published" },
              ]}
              rows={form.bulk_rows ?? []}
              onChange={(rows) => onChange({ ...form, bulk_rows: rows })}
            />
          </TabsContent>

          <TabsContent value="seo" className="mt-5 grid gap-5 xl:grid-cols-2">
            <Field label="SEO title"><Input value={form.seo_title ?? ""} onChange={(event) => onChange({ ...form, seo_title: event.target.value })} /></Field>
            <Field label="SEO description"><Input value={form.seo_description ?? ""} onChange={(event) => onChange({ ...form, seo_description: event.target.value })} /></Field>
            <Field label="SEO keywords"><Textarea rows={3} value={form.seo_keywords ?? ""} onChange={(event) => onChange({ ...form, seo_keywords: event.target.value })} /></Field>
            <Field label="Canonical URL"><Input value={form.canonical_url ?? ""} onChange={(event) => onChange({ ...form, canonical_url: event.target.value })} /></Field>
          </TabsContent>

          <TabsContent value="preview" className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <BrochurePreview form={form} categoryName={categories.find((category) => category.id === form.category_id)?.name ?? "Unassigned"} />
            <div className="space-y-4">
              <Card className="rounded-[1.5rem] border-slate-200 bg-slate-950 p-5 text-white">
                <div className="text-sm font-semibold">Brochure generator</div>
                <p className="mt-2 text-sm text-slate-300">Preview the brochure here, then export a PDF with product image, specs, applications, and contact details.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" className="bg-white text-slate-950 hover:bg-slate-100" onClick={onPreview}><Eye className="mr-2 h-4 w-4" /> Open preview</Button>
                  <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={onGeneratePdf}><Printer className="mr-2 h-4 w-4" /> Generate PDF</Button>
                </div>
              </Card>
              <Card className="rounded-[1.5rem] border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-950">Ready to save?</div>
                <p className="mt-2 text-sm text-slate-600">This product can be published, featured, and exposed immediately on the frontend once saved.</p>
                <Button type="button" className="mt-4 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={onSave} disabled={saving || !form.name?.trim()}>
                  Save product
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function BrochurePreview({ form, categoryName }: { form: ProductForm; categoryName: string }) {
  return (
    <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Brochure preview</div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{form.name || "Product name"}</h2>
          <div className="mt-1 text-sm text-slate-500">{form.subtitle || form.short_description || "Subtitle / tagline"}</div>
          <div className="mt-2 text-xs text-slate-500">Category: {categoryName}</div>
        </div>
        <Badge variant={(form.status ?? "draft") === "published" ? "default" : "secondary"} className="rounded-full">{form.status ?? "draft"}</Badge>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="space-y-3">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Product details</div>
            <p className="mt-3 text-sm leading-6 text-slate-200">{form.detailed_description || form.short_description || "Detailed product information will appear here."}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Features</div>
              <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{form.key_features || "Key features"}</div>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Applications</div>
              <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{form.applications || "Applications"}</div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Technical specifications</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {(form.specification_rows ?? []).length > 0 ? (form.specification_rows ?? []).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.property ?? ""}</TableCell>
                      <TableCell>{row.unit ?? ""}</TableCell>
                      <TableCell>{row.value ?? ""}</TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={3} className="py-6 text-center text-slate-500">No specification rows yet.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100">
            {form.image?.url && form.image.type?.startsWith?.("image/") ? <img src={form.image.url} alt={form.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">Product image</div>}
          </div>
          <div className="rounded-3xl border border-slate-200 p-4 text-sm text-slate-600">
            <div className="font-medium text-slate-950">Document pack</div>
            <div className="mt-2 space-y-1">
              <div>{form.brochure_pdf?.name ?? "Brochure PDF"}</div>
              <div>{form.tds_pdf?.name ?? "TDS PDF"}</div>
              <div>{form.msds_pdf?.name ?? "MSDS PDF"}</div>
              <div>{form.certificate?.name ?? "Certificate"}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function BulkImportDialog({
  open,
  onOpenChange,
  categories,
  onImport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onImport: (rows: RepeatableRow[]) => Promise<void>;
}) {
  const [rows, setRows] = useState<RepeatableRow[]>([]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto rounded-[1.75rem]">
        <DialogHeader>
          <DialogTitle>Bulk product list import</DialogTitle>
        </DialogHeader>
        <RepeatableEditor
          title="Paste or enter product table rows"
          columns={[
            { key: "product_name", label: "Sr./Product name", placeholder: "1 / Roving 2400 TEX" },
            { key: "application", label: "Application", placeholder: "Vacuum infusion" },
            { key: "uom", label: "Unit of measurement", placeholder: "KG" },
            { key: "category", label: "Category", placeholder: categories[0]?.name ?? "Fiber Reinforcement" },
            { key: "description", label: "Description", placeholder: "Short description", textarea: true },
            { key: "status", label: "Status", placeholder: "published" },
          ]}
          rows={rows}
          onChange={setRows}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" className="bg-slate-950 text-white hover:bg-slate-800" onClick={() => onImport(rows)}>Import products</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label className="text-slate-700">{label} {required ? "*" : ""}</Label>
      {children}
    </div>
  );
}
