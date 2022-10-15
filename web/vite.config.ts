import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  publicDir: "public",
  server: {
    open: true,
  },
  resolve: {
    alias: {
      components: resolve(__dirname, "./src/components"),
      pages: resolve(__dirname, "./src/pages"),
      utils: resolve(__dirname, "./src/utils"),
      core: resolve(__dirname, "../core/src"),
    },
  },
});
