import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in � Admin Panel" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signIn, signUp } = useAuth();
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpIdentifier, setSignUpIdentifier] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const normalizePhone = (value: string) => value.replace(/[^0-9+]/g, "");
  const isPhoneIdentifier = (value: string) => {
    const normalized = normalizePhone(value);
    return /^\+?[0-9]{6,}$/.test(normalized);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const trimmed = signInIdentifier.trim();
      await signIn(trimmed, signInPassword);
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const trimmed = signUpIdentifier.trim();
      await signUp(trimmed, signUpPassword);
      toast.success("Account created � signing you in");
      navigate({ to: "/admin" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--gradient-primary)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 text-primary-foreground">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur mb-4">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm opacity-80 mt-1">Sign in to manage your business</p>
        </div>
        {user && !authLoading && !isAdmin ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Your account is signed in, but it does not have admin permissions. Use the admin account or create the first admin account if one is not yet set up.
          </div>
        ) : null}
        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
            <div className="font-semibold">Sign-in error</div>
            <div className="mt-1">{errorMessage}</div>
          </div>
        ) : null}
        <Card className="p-6 shadow-2xl border-border/50">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create admin</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or phone</Label>
                  <Input
                    id="identifier"
                    type="text"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="admin@example.com or +1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  The first account created becomes the admin automatically.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="su-identifier">Email or phone</Label>
                  <Input
                    id="su-identifier"
                    type="text"
                    required
                    value={signUpIdentifier}
                    onChange={(e) => setSignUpIdentifier(e.target.value)}
                    placeholder="admin@example.com or +1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-password">Password (min 6)</Label>
                  <Input
                    id="su-password"
                    type="password"
                    required
                    minLength={6}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
