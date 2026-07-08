import { NavLink, useLocation, type NavLinkProps } from "react-router-dom";

type RouteParams = Record<string, string | number | null | undefined>;

type AppLinkProps = Omit<NavLinkProps, "to" | "className"> & {
  to: string;
  params?: RouteParams;
  className?: string;
  activeProps?: {
    className?: string;
  };
  activeOptions?: {
    exact?: boolean;
  };
};

function joinClasses(...values: Array<string | null | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function buildPath(to: string, params?: RouteParams) {
  let resolved = to;

  for (const [key, value] of Object.entries(params ?? {})) {
    resolved = resolved.replaceAll(`$${key}`, encodeURIComponent(String(value ?? "")));
  }

  return resolved;
}

export function Link({
  to,
  params,
  className,
  activeProps,
  activeOptions,
  ...props
}: AppLinkProps) {
  const resolvedTo = buildPath(to, params);

  return (
    <NavLink
      {...props}
      to={resolvedTo}
      end={activeOptions?.exact}
      className={({ isActive }) =>
        joinClasses(className, isActive ? activeProps?.className : undefined)
      }
    />
  );
}

export function usePathname() {
  return useLocation().pathname;
}
