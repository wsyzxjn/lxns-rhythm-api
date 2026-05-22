import { defineConfig } from "tsdown";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: !isProduction,
    format: ["esm", "cjs"],
    clean: true,
    dts: true,
    exports: true,
    deps: {
      alwaysBundle: ["ky"],
      onlyBundle: ["ky"],
    },
  },
]);
