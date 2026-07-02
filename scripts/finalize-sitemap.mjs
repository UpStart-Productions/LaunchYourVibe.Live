/**
 * @astrojs/sitemap always emits `${filenameBase}-index.xml`. Crawlers and docs
 * commonly expect the sitemap index at /sitemap.xml — rename after build.
 */
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const from = join(dist, "sitemap-index.xml");
const to = join(dist, "sitemap.xml");

if (!existsSync(from)) {
  console.warn("[finalize-sitemap] dist/sitemap-index.xml not found; skip rename.");
  process.exit(0);
}

renameSync(from, to);
console.log("[finalize-sitemap] dist/sitemap.xml (sitemap index) ready.");
