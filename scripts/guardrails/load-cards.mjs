import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CARDS_DIR = join(process.cwd(), "src/components/cards");

/**
 * @param {string} source
 * @returns {{ domain: string; title: string; rule: string }}
 */
export function parseUxCardMeta(source) {
  const match = source.match(/<UxCard[\s\S]*?\n>/);
  if (!match) {
    throw new Error("UxCard opening tag not found");
  }

  const tag = match[0];
  const getAttr = (name) => {
    const quoted = tag.match(new RegExp(`${name}="([^"]*)"`));
    if (quoted) return quoted[1];

    const backtick = tag.match(new RegExp(`${name}=\`([^\`]*)\``));
    if (backtick) return backtick[1];

    return "";
  };

  return {
    domain: getAttr("domain"),
    title: getAttr("title"),
    rule: getAttr("rule"),
  };
}

/**
 * @returns {import("./config.mjs").CardRecord[]}
 */
export function loadCards() {
  const files = readdirSync(CARDS_DIR)
    .filter((name) => name.endsWith(".astro"))
    .sort();

  return files.map((fileName) => {
    const source = readFileSync(join(CARDS_DIR, fileName), "utf8");
    const { domain, title, rule } = parseUxCardMeta(source);
    const idMatch = fileName.match(/^([A-Z])(\d+)\.astro$/);

    if (!idMatch) {
      throw new Error(`Invalid card file name: ${fileName}`);
    }

    const id = `${idMatch[1]}-${idMatch[2]}`;

    if (!domain || !title || !rule) {
      throw new Error(`Missing UxCard metadata in ${fileName}`);
    }

    return {
      id,
      slug: id.toLowerCase(),
      domain,
      title,
      rule,
      sourcePath: join("src/components/cards", fileName),
      source,
    };
  });
}

/**
 * @param {import("./config.mjs").CardRecord[]} cards
 */
export function cardsContentHash(cards) {
  return cards
    .map((card) =>
      [card.id, card.domain, card.title, card.rule, card.sourcePath].join("\0"),
    )
    .join("\n");
}
