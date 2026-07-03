import type { AstroComponentFactory } from "astro/runtime/server/index.js";

const modules = import.meta.glob<{ default: AstroComponentFactory }>(
  "../components/cards/*.astro",
  { eager: true }
);

function fileNameToCardId(name: string): string {
  const match = name.match(/^([A-Z])(\d+)\.astro$/);
  if (!match) throw new Error(`Invalid card file name: ${name}`);
  return `${match[1]}-${match[2]}`;
}

export type CardEntry = {
  id: string;
  slug: string;
  component: AstroComponentFactory;
};

export const CARDS: CardEntry[] = Object.keys(modules)
  .map((path) => {
    const name = path.split("/").pop()!;
    const id = fileNameToCardId(name);
    return {
      id,
      slug: id.toLowerCase(),
      component: modules[path].default,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const CARD_BY_SLUG = Object.fromEntries(CARDS.map((c) => [c.slug, c]));

export function cardPermalink(id: string, site: URL): string {
  return new URL(`/card/${id.toLowerCase()}`, site).href;
}
