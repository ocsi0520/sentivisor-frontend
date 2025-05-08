import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: {
        "side-panel": "src/SidePanel/index.html",
        content: "src/content/content.ts",
        worker: "src/worker/worker.ts",
        consent: "src/consent/consent.html",
      },
      output: {
        dir: "dist",
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        format: "es",
      },
    },
  },
  plugins: [tsconfigPaths()],
  optimizeDeps: {
    include: ["franc", "chart.js"],
    esbuildOptions: {
      target: "esnext",
    },
  },
});
