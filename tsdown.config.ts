import { defineConfig, type UserConfig } from "tsdown";

const isProduction = process.env.NODE_ENV === "production";

const DEFAULT_CONFIG: UserConfig = {
  entry: ["src/index.ts"],
  outDir: "dist",
  sourcemap: !isProduction,
  outExtensions: ({ format }) => ({
    js: format === "es" ? ".js" : ".cjs",
  }),
};

export default defineConfig([
  {
    ...DEFAULT_CONFIG,
    format: "esm",
    clean: true,
    dts: true,
    deps: {
      neverBundle: ["ky"],
    },
  },
  {
    ...DEFAULT_CONFIG,
    format: "cjs",
    clean: false,
    dts: false,
    deps: {
      alwaysBundle: ["ky"],
      onlyBundle: false,
    },
  },
]);
