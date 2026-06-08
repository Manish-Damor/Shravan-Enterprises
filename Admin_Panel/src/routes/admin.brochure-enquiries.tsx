import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Mail, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/brochure-enquiries")({ component: BrochureEnquiriesPage });

type BrochureEnquiry = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

function BrochureEnquiriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BrochureEnquiry | null>(null);
  const [toDelete, setToDelete] = useState<BrochureEnquiry | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["brochure-enquiries"],
    queryFn: async () => apiFetch<BrochureEnquiry[]>("/api/brochure-enquiries"),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => apiFetch(`/api/brochure-enquiries/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brochure-enquiries"] });
      toast.success("Deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((it) => [it.name, it.email].join(" ").toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Brochure enquiries
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Brochure requests</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">List of users who requested brochures via the website.</p>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className="pl-9" />
          </div>
          <Badge className="rounded-full bg-slate-100 text-slate-700">{filtered.length} requests</Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="py-10 text-center text-slate-500">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-10 text-center text-slate-500">No requests found.</TableCell></TableRow>
              ) : filtered.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{it.name}</div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{it.email}</TableCell>
                  <TableCell className="text-xs text-slate-500">{format(new Date(it.createdAt ?? Date.now()), "PP")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelected(it)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setToDelete(it)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
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
        <DialogContent className="max-w-xl rounded-[1.75rem]">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Email" value={selected.email} />
                <InfoCard label="Date" value={format(new Date(selected.createdAt ?? Date.now()), "PPpp")} />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete request?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (toDelete) deleteItem.mutate(toDelete.id); setToDelete(null); }}>Delete</AlertDialogAction>
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
