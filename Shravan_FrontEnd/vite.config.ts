// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 8094,
      strictPort: true,
      allowedHosts: [
        ".ngrok-free.dev",
        ".trycloudflare.com",
        "localhost",
        "127.0.0.1"
      ],
      proxy: {
        "/api": "http://localhost:8082",
      },
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  },

  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});
