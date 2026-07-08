import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAdminSearch } from "@/components/admin/admin-search";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

type UserAccount = {
  id: string;
  email: string | null;
  phone: string | null;
  role: "super_admin" | "product_manager" | "content_manager" | "sales_manager" | "admin" | "user";
  permissions?: string[];
  created_at: string;
  updated_at: string;
};

const roleMeta: Record<string, { label: string; tone: string; permissions: string[] }> = {
  super_admin: { label: "Super Admin", tone: "bg-slate-950 text-white", permissions: ["All access"] },
  product_manager: { label: "Product Manager", tone: "bg-sky-600 text-white", permissions: ["Products", "Categories", "Brochures"] },
  content_manager: { label: "Content Manager", tone: "bg-emerald-600 text-white", permissions: ["Website content", "Banners", "Clients"] },
  sales_manager: { label: "Sales / Enquiry Manager", tone: "bg-amber-500 text-white", permissions: ["Enquiries", "Follow-ups"] },
  admin: { label: "Admin", tone: "bg-slate-700 text-white", permissions: ["General access"] },
  user: { label: "User", tone: "bg-slate-200 text-slate-700", permissions: ["Limited access"] },
};

function UsersPage() {
  const qc = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { query, configure } = useAdminSearch();

  useEffect(() => {
    configure({
      enabled: true,
      placeholder: "Search users by email, phone, or user ID",
    });
  }, [configure]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => apiFetch<UserAccount[]>("/api/users"),
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserAccount["role"] }) => apiFetch(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify({ role }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedQuery = query.toLowerCase();
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSearch = (user.email ?? "").toLowerCase().includes(normalizedQuery) || (user.phone ?? "").toLowerCase().includes(normalizedQuery) || user.id.toLowerCase().includes(normalizedQuery);
      return matchesRole && matchesSearch;
    });
  }, [users, query, roleFilter]);

  const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Shield className="h-3.5 w-3.5" /> Security & role management
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Admin users and permissions</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Manage super admins, product managers, content managers, and sales users from one place.</p>
        </div>
        <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{users.length} total accounts</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(roleMeta).slice(0, 4).map(([role, meta]) => (
          <Card key={role} className="rounded-3xl border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{meta.label}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{roleCounts[role] ?? 0}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
              {meta.permissions.map((permission) => <Badge key={permission} variant="secondary">{permission}</Badge>)}
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Role filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {Object.entries(roleMeta).map(([role, meta]) => <SelectItem key={role} value={role}>{meta.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Permissions</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={4}>Loading accounts...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={4}>No accounts found.</td></tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-950">{user.email ?? user.phone ?? user.id}</div>
                      <div className="text-xs text-slate-500">{user.email ? user.phone ?? "Email login" : "Phone login"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <Select value={user.role} onValueChange={(role) => updateUser.mutate({ id: user.id, role: role as UserAccount["role"] })}>
                        <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleMeta).map(([role, meta]) => <SelectItem key={role} value={role}>{meta.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${roleMeta[user.role]?.tone ?? "bg-slate-200 text-slate-700"}`}>
                        {roleMeta[user.role]?.label ?? user.role}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(user.permissions ?? roleMeta[user.role]?.permissions ?? []).map((permission) => <Badge key={permission} variant="secondary">{permission}</Badge>)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">{new Date(user.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
