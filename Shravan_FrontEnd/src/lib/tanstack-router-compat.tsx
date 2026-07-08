import type { ComponentType, ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Link } from "./router";

type FileRouteConfig = {
  component?: ComponentType<any>;
  loader?: (...args: any[]) => any;
  head?: (...args: any[]) => any;
  notFoundComponent?: ComponentType<any> | (() => ReactNode);
  [key: string]: unknown;
};

export { Link, Outlet };

export function useRouterState<T>({
  select,
}: {
  select: (state: { location: { pathname: string } }) => T;
}) {
  const location = useLocation();
  return select({ location: { pathname: location.pathname } });
}

export function createFileRoute(path: string) {
  return function registerRoute<T extends FileRouteConfig>(config: T) {
    return {
      ...config,
      path,
      useLoaderData() {
        throw new Error(`Loader data is not available for "${path}" in compatibility mode.`);
      },
    };
  };
}

export function notFound() {
  return new Error("Not found");
}
