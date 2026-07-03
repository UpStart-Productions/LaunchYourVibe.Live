import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { parseUxCardMeta } from "../utils/card-seo";

const modules = import.meta.glob<{ default: AstroComponentFactory }>(
  "../components/cards/*.astro",
  { eager: true }
);

const rawModules = import.meta.glob<string>("../components/cards/*.astro", {
  query: "?raw",
  import: "default",
  eager: true,
});

function fileNameToCardId(name: string): string {
  const match = name.match(/^([A-Z])(\d+)\.astro$/);
  if (!match) throw new Error(`Invalid card file name: ${name}`);
  return `${match[1]}-${match[2]}`;
}

export type CardEntry = {
  id: string;
  slug: string;
  domain: string;
  title: string;
  rule: string;
  component: AstroComponentFactory;
};

export const CARDS: CardEntry[] = Object.keys(modules)
  .map((path) => {
    const name = path.split("/").pop()!;
    const id = fileNameToCardId(name);
    const { domain, title, rule } = parseUxCardMeta(rawModules[path]);

    if (!domain || !title || !rule) {
      throw new Error(`Missing UxCard metadata in ${name}`);
    }

    return {
      id,
      slug: id.toLowerCase(),
      domain,
      title,
      rule,
      component: modules[path].default,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const CARD_BY_SLUG = Object.fromEntries(CARDS.map((c) => [c.slug, c]));

export function cardPermalink(id: string, site: URL): string {
  return new URL(`/card/${id.toLowerCase()}`, site).href;
}
