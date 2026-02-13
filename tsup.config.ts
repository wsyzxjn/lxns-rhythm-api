// tsup.config.ts
import { defineConfig, type Options } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

const DEFAULT_CONFIG: Options = {
  entry: ["src/index.ts"],
  dts: true,
  outDir: "dist",
  sourcemap: !isProduction,
  skipNodeModulesBundle: true,
};

export default defineConfig([
  {
    ...DEFAULT_CONFIG,
    format: "esm",
    clean: true,
  },
  {
    ...DEFAULT_CONFIG,
    format: "cjs",
    clean: false,
    dts: false,
    noExternal: ["ky"],
  },
]);
