/**
 * Regenerate IconSprite.astro and types.ts from lucide-astro source files.
 * Run after adding a new icon: node scripts/generate-icon-sprite.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const ICONS_DIR = join(ROOT, "src/components/icons");
const LUCIDE_DIR = join(ROOT, "node_modules/lucide-astro/dist");

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "icons") walk(path, files);
    else if (path.endsWith(".astro") && !path.includes("/icons/")) files.push(path);
  }
  return files;
}

const used = new Set();
for (const file of walk(join(ROOT, "src"))) {
  const text = readFileSync(file, "utf8");
  const importMatch = text.match(/import type \{ IconName \}/);
  if (importMatch) {
    const names = text.match(/icon: "(\w+)"/g);
    names?.forEach((m) => used.add(m.match(/"(\w+)"/)[1]));
  }
  for (const match of text.matchAll(/<Icon name="(\w+)"/g)) {
    used.add(match[1]);
  }
}

const iconData = {};
for (const name of [...used].sort()) {
  const file = join(LUCIDE_DIR, `${name}.astro`);
  if (!existsSync(file)) {
    console.warn(`[generate-icon-sprite] Missing lucide icon: ${name}`);
    continue;
  }
  const text = readFileSync(file, "utf8");
  const slug = text.match(/<Layout iconName="([^"]+)"/)?.[1];
  const paths = text.split("<Layout")[1]?.split(">").slice(1).join(">").replace(/<\/Layout>/, "").trim();
  iconData[name] = { slug, paths };
}

const bySlug = new Map();
for (const { slug, paths } of Object.values(iconData)) {
  if (!bySlug.has(slug)) bySlug.set(slug, paths);
}

const symbols = [...bySlug.entries()]
  .map(
    ([slug, paths]) =>
      `    <symbol id="icon-${slug}" viewBox="0 0 24 24">\n      ${paths.replace(/\t/g, "      ")}\n    </symbol>`,
  )
  .join("\n");

writeFileSync(
  join(ICONS_DIR, "IconSprite.astro"),
  `---
/** Inline SVG sprite — one copy of each icon for <use> references sitewide. */
---

<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
  <defs>
${symbols}
  </defs>
</svg>
`,
);

const names = Object.keys(iconData).sort();
writeFileSync(
  join(ICONS_DIR, "types.ts"),
  `/** Lucide icon names used in this project (PascalCase). */\nexport type IconName = ${names.map((n) => `"${n}"`).join(" | ")};\n\nexport const ICON_SLUGS: Record<IconName, string> = ${JSON.stringify(
    Object.fromEntries(Object.entries(iconData).map(([k, v]) => [k, v.slug])),
    null,
    2,
  )};\n`,
);

console.log(`[generate-icon-sprite] ${bySlug.size} symbols, ${names.length} IconName entries`);
