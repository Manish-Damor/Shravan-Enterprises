import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Access denied</h1>
          <p className="text-muted-foreground text-sm mb-4">
            This account is signed in successfully, but it does not have admin permissions.
          </p>
          <div className="space-y-3 text-sm text-muted-foreground mb-6">
            <p>Signed in as: <span className="font-medium text-foreground">{user?.email ?? user?.phone ?? "Unknown"}</span></p>
            <p>If you expected admin access, sign in with the admin account or create the first admin account using the login screen.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => signOut()}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600"
            >
              Sign out
            </button>
            <button
              onClick={() => navigate({ to: "/login" })}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminShell />
  );
}