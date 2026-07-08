import { useEffect, type ComponentType } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { Route as AboutRoute } from "@/routes/about";
import { Route as BrochureRoute } from "@/routes/brochure";
import { Route as CertificationsRoute } from "@/routes/certifications";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as GalleryRoute } from "@/routes/gallery";
import { Route as HomeRoute } from "@/routes/index";
import { Route as IndustriesRoute } from "@/routes/industries";
import { Route as ProductsRoute } from "@/routes/products";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductCategoryPage from "@/pages/ProductCategoryPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function NotFoundPage() {
  return (
    <div className="container mx-auto px-6 py-32 text-center">
      <h1 className="text-4xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you requested does not exist.
      </p>
    </div>
  );
}

function renderRouteComponent(route: { component?: ComponentType }) {
  const Component = route.component;
  return Component ? <Component /> : <NotFoundPage />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={renderRouteComponent(HomeRoute)} />
          <Route path="/about" element={renderRouteComponent(AboutRoute)} />
          <Route path="/brochure" element={renderRouteComponent(BrochureRoute)} />
          <Route path="/certifications" element={renderRouteComponent(CertificationsRoute)} />
          <Route path="/contact" element={renderRouteComponent(ContactRoute)} />
          <Route path="/gallery" element={renderRouteComponent(GalleryRoute)} />
          <Route path="/industries" element={renderRouteComponent(IndustriesRoute)} />
          <Route path="/products" element={renderRouteComponent(ProductsRoute)} />
          <Route path="/products/:slug" element={<ProductCategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
