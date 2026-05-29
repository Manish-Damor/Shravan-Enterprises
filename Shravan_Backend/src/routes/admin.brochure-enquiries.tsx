import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/brochure-enquiries")({
  component: BrochureEnquiriesPage,
  head: () => ({ meta: [{ title: "Brochure Enquiries - Admin Panel" }] }),
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BrochureEnquiry = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

function BrochureEnquiriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<BrochureEnquiry | null>(null);
  const [toDelete, setToDelete] = useState<BrochureEnquiry | null>(null);

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["brochure-enquiries"],
    queryFn: async () => apiFetch<BrochureEnquiry[]>("/api/brochure-enquiries"),
  });

  const saveEnquiry = useMutation({
    mutationFn: async (enquiry: BrochureEnquiry) =>
      apiFetch(`/api/brochure-enquiries/${enquiry.id}`, {
        method: "PUT",
        body: JSON.stringify(enquiry),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brochure-enquiries"] });
      setEditing(null);
      toast.success("Brochure enquiry updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteEnquiry = useMutation({
    mutationFn: async (id: string) =>
      apiFetch(`/api/brochure-enquiries/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brochure-enquiries"] });
      setToDelete(null);
      toast.success("Brochure enquiry deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return enquiries;

    return enquiries.filter((item) =>
      [item.name, item.email].join(" ").toLowerCase().includes(query),
    );
  }, [enquiries, search]);

  const handleSave = () => {
    if (!editing) return;

    const name = editing.name.trim();
    const email = editing.email.trim().toLowerCase();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    saveEnquiry.mutate({ ...editing, name, email });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Brochure enquiries
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Brochure download requests
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          View the names and email addresses collected from the brochure request form.
        </p>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email"
              className="pl-9"
            />
          </div>
          <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">
            {filtered.length} requests
          </Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-slate-500">
                    Loading brochure enquiries...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-slate-500">
                    No brochure enquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-950">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                          <FileText className="h-4 w-4" />
                        </span>
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{item.email}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {format(new Date(item.createdAt ?? Date.now()), "PPpp")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setEditing(item)}
                        >
                          <Pencil className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setToDelete(item)}
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
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-xl rounded-[1.75rem]">
          <DialogHeader>
            <DialogTitle>Edit brochure enquiry</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brochure-enquiry-name">Name</Label>
                <Input
                  id="brochure-enquiry-name"
                  value={editing.name}
                  onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brochure-enquiry-email">Email</Label>
                <Input
                  id="brochure-enquiry-email"
                  type="email"
                  value={editing.email}
                  onChange={(event) => setEditing({ ...editing, email: event.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="font-medium text-slate-950">Date / Time</div>
                <div className="mt-1">
                  {format(new Date(editing.createdAt ?? Date.now()), "PPpp")}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="rounded-2xl" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button
                  className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                  disabled={saveEnquiry.isPending}
                  onClick={handleSave}
                >
                  {saveEnquiry.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete brochure enquiry?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) {
                  deleteEnquiry.mutate(toDelete.id);
                }
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
