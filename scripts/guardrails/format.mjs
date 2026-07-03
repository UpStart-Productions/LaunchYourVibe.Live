import { SITE, STARTER_TRIGGERS } from "./config.mjs";

/**
 * @param {string} html
 */
export function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} html
 */
export function ruleToMarkdown(html) {
  const decoded = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;lt;/g, "<")
    .replace(/&amp;gt;/g, ">")
    .replace(/&amp;amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();

  return decoded;
}

/**
 * @param {{ id: string; slug: string; domain: string; title: string; rule: string }} card
 */
export function cardPermalink(card) {
  return `${SITE.url}/card/${card.slug}`;
}

/**
 * @param {{ id: string; domain: string; title: string; rule: string }} card
 */
export function defaultTrigger(card) {
  if (STARTER_TRIGGERS[card.id]) {
    return STARTER_TRIGGERS[card.id];
  }

  return `Working on ${stripHtml(card.title).toLowerCase()} (${card.domain})`;
}

/**
 * @param {{ id: string; slug: string; domain: string; title: string; rule: string }} card
 * @param {{ includeTrigger?: boolean }} [options]
 */
export function formatAgentRule(card, options = {}) {
  const includeTrigger = options.includeTrigger ?? true;
  const lines = [
    `### ${card.id} — ${stripHtml(card.title)}`,
    "",
  ];

  if (includeTrigger) {
    lines.push(`**When:** ${defaultTrigger(card)}`, "");
  }

  lines.push(
    `**Rule:** ${ruleToMarkdown(card.rule)}`,
    "",
    `**Reference:** ${cardPermalink(card)}`,
    "",
  );

  return lines.join("\n");
}

/**
 * @param {{ id: string; slug: string; domain: string; title: string; rule: string }} card
 */
export function formatCheatsheetEntry(card) {
  return [
    `## ${card.id} — ${stripHtml(card.title)}`,
    "",
    `**Domain:** ${card.domain}`,
    "",
    ruleToMarkdown(card.rule),
    "",
    `[View card →](${cardPermalink(card)})`,
    "",
  ].join("\n");
}
