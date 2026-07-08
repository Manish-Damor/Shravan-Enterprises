import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  base: "./",
  server: {
    port: 8094,
    strictPort: true,
    allowedHosts: [".ngrok-free.dev", ".trycloudflare.com", "localhost", "127.0.0.1"],
    proxy: {
      "/api": "http://localhost:8082",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
