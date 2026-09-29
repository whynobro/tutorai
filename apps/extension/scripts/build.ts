import { build, context } from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outdir = resolve(root, "dist");
const watch = process.argv.includes("--watch");
const apiUrl = process.env.TUTOR_API_URL ?? "http://127.0.0.1:8787/v1/check";

await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });
await cp(resolve(root, "manifest.json"), resolve(outdir, "manifest.json"));

const options = {
  entryPoints: {
    background: resolve(root, "src/background.ts"),
    content: resolve(root, "src/content/index.tsx"),
  },
  bundle: true,
  format: "esm" as const,
  target: "chrome120",
  outdir,
  minify: !watch,
  sourcemap: watch,
  define: {
    __TUTOR_API_URL__: JSON.stringify(apiUrl),
    "process.env.NODE_ENV": JSON.stringify(watch ? "development" : "production"),
  },
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log(`Watching extension sources. API: ${apiUrl}`);
} else {
  await build(options);
  console.log(`Built extension in ${outdir}`);
}
