import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("@tanstack/react-query")) {
            return "query";
          }

          if (id.includes("lucide-react") || id.includes("phosphor-react")) {
            return "icons";
          }

          if (
            id.includes("@radix-ui") ||
            id.includes("sonner") ||
            id.includes("cmdk") ||
            id.includes("react-day-picker") ||
            id.includes("embla-carousel-react") ||
            id.includes("vaul")
          ) {
            return "ui";
          }

          return "vendor";
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
