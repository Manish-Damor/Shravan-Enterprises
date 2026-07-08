import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Mail, Phone, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/enquiries")({ component: EnquiriesPage });

type Enquiry = {
  id: string;
  customer_name: string;
  mobile: string;
  email: string | null;
  product_name?: string | null;
  product_id?: string | null;
  category_id?: string | null;
  message: string | null;
  status: "new" | "contacted" | "closed";
  reply_note?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

function EnquiriesPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [toDelete, setToDelete] = useState<Enquiry | null>(null);
  const { query, configure } = useAdminSearch();

  useEffect(() => {
    configure({
      enabled: true,
      placeholder: "Search enquiries by customer, product, email, or mobile",
    });
  }, [configure]);

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => apiFetch<Enquiry[]>("/api/enquiries"),
  });

  const saveEnquiry = useMutation({
    mutationFn: async (enquiry: Enquiry) => apiFetch(`/api/enquiries/${enquiry.id}`, { method: "PUT", body: JSON.stringify(enquiry) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Enquiry updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteEnquiry = useMutation({
    mutationFn: async (id: string) => apiFetch(`/api/enquiries/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast.success("Enquiry deleted");
    },
  });

  const filtered = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const normalizedQuery = query.toLowerCase();
      const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
      const matchesSearch = [enquiry.customer_name, enquiry.mobile, enquiry.email ?? "", enquiry.product_name ?? "", enquiry.message ?? ""].join(" ").toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesSearch;
    });
  }, [enquiries, query, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Enquiry management
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Customer enquiries and follow-up queue</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Track all product enquiries, reply notes, and support status from one place.</p>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{filtered.length} enquiries</Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-slate-500">Loading enquiries...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-slate-500">No enquiries found.</TableCell></TableRow>
              ) : filtered.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{enquiry.customer_name}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3.5 w-3.5" /> {enquiry.mobile}</div>
                    {enquiry.email ? <div className="flex items-center gap-1 text-xs text-slate-500"><Mail className="h-3.5 w-3.5" /> {enquiry.email}</div> : null}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{enquiry.product_name ?? "—"}</TableCell>
                  <TableCell className="max-w-xs text-sm text-slate-500">{enquiry.message ?? "—"}</TableCell>
                  <TableCell><Badge variant={enquiry.status === "new" ? "default" : enquiry.status === "contacted" ? "secondary" : "outline"}>{enquiry.status}</Badge></TableCell>
                  <TableCell className="text-xs text-slate-500">{format(new Date(enquiry.createdAt ?? Date.now()), "PP")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelected(enquiry)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setToDelete(enquiry)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[1.75rem]">
          <DialogHeader>
            <DialogTitle>{selected?.customer_name}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Mobile" value={selected.mobile} />
                <InfoCard label="Email" value={selected.email ?? "—"} />
                <InfoCard label="Product" value={selected.product_name ?? "—"} />
                <InfoCard label="Date" value={format(new Date(selected.createdAt ?? Date.now()), "PPpp")} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selected.status} onValueChange={(value) => setSelected({ ...selected, status: value as Enquiry["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea readOnly rows={4} value={selected.message ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Reply note</Label>
                <Textarea rows={4} value={selected.reply_note ?? ""} onChange={(event) => setSelected({ ...selected, reply_note: event.target.value })} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => saveEnquiry.mutate(selected)}>Save changes</Button>
                {selected.email ? <Button asChild variant="outline" className="rounded-2xl"><a href={`mailto:${selected.email}?subject=Re: ${selected.product_name ?? "your enquiry"}`}>Reply by email</a></Button> : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete enquiry?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) deleteEnquiry.mutate(toDelete.id); setToDelete(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-950">{value}</div>
    </div>
  );
}
