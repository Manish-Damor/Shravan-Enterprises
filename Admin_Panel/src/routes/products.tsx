import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/products")({
  component: RedirectToAdminProducts,
});

function RedirectToAdminProducts() {
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to the admin products manager when someone hits /products on the admin app
    navigate({ to: "/admin/products" });
  }, [navigate]);
  return null;
}
