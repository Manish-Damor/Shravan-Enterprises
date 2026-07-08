import { createContext, useContext } from "react";

export type AdminSearchConfig = {
  placeholder: string;
  enabled?: boolean;
};

export type AdminSearchContextValue = {
  draft: string;
  query: string;
  enabled: boolean;
  placeholder: string;
  setDraft: (value: string) => void;
  submit: () => void;
  reset: () => void;
  configure: (config: AdminSearchConfig) => void;
};

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null);

export function AdminSearchProvider({
  value,
  children,
}: {
  value: AdminSearchContextValue;
  children: React.ReactNode;
}) {
  return <AdminSearchContext.Provider value={value}>{children}</AdminSearchContext.Provider>;
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);

  if (!context) {
    throw new Error("useAdminSearch must be used within AdminSearchProvider");
  }

  return context;
}
