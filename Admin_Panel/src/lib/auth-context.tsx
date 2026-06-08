import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, clearAuthToken } from "@/lib/api";

interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: "super_admin" | "product_manager" | "content_manager" | "sales_manager" | "admin" | "user";
  created_at: string;
  updated_at: string;
}

interface AuthCtx {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
  updateAccount: (updates: { email?: string; phone?: string; password?: string }) => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  updateAccount: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await apiFetch<AuthUser>("/api/auth/me");
        setUser(userData);
        setIsAdmin(userData.role !== "user");
      } catch {
        clearAuthToken();
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });

    window.localStorage.setItem("wwk_auth_token", data.token);
    setUser(data.user);
    setIsAdmin(data.user.role !== "user");
  };

  const signUp = async (identifier: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });

    window.localStorage.setItem("wwk_auth_token", data.token);
    setUser(data.user);
    setIsAdmin(data.user.role !== "user");
  };

  const signOut = () => {
    clearAuthToken();
    setUser(null);
    setIsAdmin(false);
  };

  const updateAccount = async (updates: { email?: string; phone?: string; password?: string }) => {
    const userData = await apiFetch<AuthUser>("/api/auth/account", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    setUser(userData);
    setIsAdmin(userData.role !== "user");
  };

  return (
    <Ctx.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut, updateAccount }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
