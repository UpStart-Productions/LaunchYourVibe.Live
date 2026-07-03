import {
  DOMAIN_BY_LABEL,
  DOMAIN_PACKS,
  KIT_ROOT_DIR,
  SITE,
  STARTER_CARD_IDS,
} from "./config.mjs";
import { formatAgentRule, formatCheatsheetEntry } from "./format.mjs";

/**
 * @param {import("./load-cards.mjs").CardRecord[]} cards
 */
function cardsById(cards) {
  return Object.fromEntries(cards.map((card) => [card.id, card]));
}

/**
 * @param {import("./load-cards.mjs").CardRecord[]} cards
 * @param {string[]} ids
 */
function pickCards(cards, ids) {
  const map = cardsById(cards);
  return ids.map((id) => {
    const card = map[id];
    if (!card) {
      throw new Error(`Starter card not found: ${id}`);
    }
    return card;
  });
}

/**
 * @param {string} title
 * @param {string} description
 * @param {boolean} alwaysApply
 * @param {string} body
 */
function mdcFile(title, description, alwaysApply, body) {
  return [
    "---",
    `description: ${description}`,
    `alwaysApply: ${alwaysApply}`,
    "---",
    "",
    `# ${title}`,
    "",
    body.trim(),
    "",
  ].join("\n");
}

/**
 * @param {import("./load-cards.mjs").CardRecord[]} starterCards
 */
function starterRuleBody(starterCards) {
  const rules = starterCards.map((card) => formatAgentRule(card)).join("\n");

  return [
    `${SITE.name} starter guardrails — always-on rules for vibe coders who ship with AI.`,
    "",
    "Apply these proactively while generating UI, forms, auth, and data-handling code.",
    "",
    "Before marking work complete, offer to run the **LaunchYourVibe ship check** skill (see `cursor/skills/launchyourvibe-ship-check/`).",
    "",
    rules,
  ].join("\n");
}

/**
 * @param {import("./load-cards.mjs").CardRecord[]} domainCards
 * @param {string} label
 */
function domainRuleBody(domainCards, label) {
  const rules = domainCards
    .map((card) => formatAgentRule(card, { includeTrigger: true }))
    .join("\n");

  return [
    `Optional ${label} rules from ${SITE.name}. Enable this rule when working in this domain.`,
    "",
    rules,
  ].join("\n");
}

/**
 * @param {import("./load-cards.mjs").CardRecord[]} cards
 */
function shipCheckSkill(cards) {
  const frontmatter = [
    "---",
    "name: launchyourvibe-ship-check",
    `description: Review UI and app code against ${SITE.name} reference standards (UX, accessibility, security, privacy). Use when the user asks for a vibe check, ship check, UX review, accessibility pass, or before shipping a feature.`,
    "disable-model-invocation: true",
    "---",
  ].join("\n");

  const body = [
    frontmatter,
    "",
    `# ${SITE.name} Ship Check`,
    "",
    "Run a structured review of the current feature or changed files against LaunchYourVibe standards.",
    "",
    "## When to use",
    "",
    "- User asks for a vibe check, ship check, or pre-ship review",
    "- Before marking a UI feature, form flow, or auth/data feature complete",
    "- After building empty states, charts, modals, or icon-button toolbars",
    "",
    "## Procedure",
    "",
    "1. Identify what was built (screens, components, API routes, forms, auth).",
    "2. Read [reference.md](reference.md) for the full rule library — focus on domains relevant to the work.",
    "3. Check the code against applicable rules. Flag violations with:",
    "   - Card ID (e.g. A-04)",
    "   - What's wrong",
    "   - Concrete fix",
    "   - Permalink to the card",
    "4. Prioritize: accessibility and security issues first, then UX polish.",
    "5. End with a short pass/fail summary and a numbered fix list.",
    "",
    "## Output format",
    "",
    "```markdown",
    "## LaunchYourVibe Ship Check",
    "",
    "**Scope:** [what you reviewed]",
    "",
    "### Issues",
    "1. **[A-04] Icon delete button** — missing aria-label. Fix: add aria-label=\"Delete item\". Reference: https://launchyourvibe.live/card/a-04",
    "",
    "### Passed",
    "- N-01 empty state includes headline and CTA",
    "",
    "**Verdict:** Needs fixes (1 critical, 0 moderate)",
    "```",
    "",
    "## Notes",
    "",
    "- Do not invent rules not in reference.md.",
    "- If unsure, cite the closest card and explain the gap.",
    "- Link every issue to its card permalink.",
    "",
  ].join("\n");

  const reference = [
    `# ${SITE.name} Rule Reference`,
    "",
    `Full library (${cards.length} cards). Generated from ${SITE.url}.`,
    "",
    "Each rule includes a **When** trigger, the rule text, and a permalink to the visual card.",
    "",
    cards.map((card) => formatAgentRule(card)).join("\n"),
  ].join("\n");

  return { skillMd: body, referenceMd: reference };
}

/**
 * @param {import("./load-cards.mjs").CardRecord[]} cards
 */
function cheatsheet(cards) {
  const sections = DOMAIN_PACKS.map((pack) => {
    const domainCards = cards.filter((card) => card.domain === pack.label);
    const entries = domainCards.map((card) => formatCheatsheetEntry(card)).join("\n");

    return [`# ${pack.label}`, "", entries].join("\n");
  });

  return [
    `# ${SITE.name} Cheat Sheet`,
    "",
    `${cards.length} reference cards for vibe coders. Visual deck: ${SITE.url}`,
    "",
    "This file is for human lookup — not for loading into agent context.",
    "",
    ...sections,
  ].join("\n");
}

function installGuide() {
  return [
    `# Install ${SITE.name} Guardrails`,
    "",
    "Plain-language setup for vibe coders using Cursor. Takes about 5 minutes.",
    "",
    "## What you got",
    "",
    "- **Starter rules** — always-on guardrails (~28 highest-impact rules)",
    "- **Domain packs** — optional rules by topic (enable what you need)",
    "- **Ship-check skill** — run a full review before you ship",
    "- **Cheat sheet** — all 120 cards in one searchable doc",
    "",
    "## Cursor setup",
    "",
    "1. Open your project in Cursor.",
    "2. Copy the `cursor/rules/` folder from this kit into your project's `.cursor/rules/` directory.",
    "   - Merge with existing rules if you already have some.",
    "3. Copy `cursor/skills/launchyourvibe-ship-check/` into `.cursor/skills/launchyourvibe-ship-check/`.",
    "4. In Cursor, confirm **launchyourvibe-starter** is enabled (always apply).",
    "5. Optionally enable domain packs when you're working in that area — e.g. turn on **launchyourvibe-accessibility** while building forms.",
    "",
    "## Using the ship-check skill",
    "",
    "When you finish a feature, ask Cursor:",
    "",
    "> Run a LaunchYourVibe ship check on [this screen / these files]",
    "",
    "The skill walks the agent through your code against the full rule library.",
    "",
    "## Other tools",
    "",
    "The `portable/rules/` folder has plain Markdown copies without Cursor frontmatter.",
    "Adapt them for Claude Code, Windsurf, Copilot, or AGENTS.md as needed.",
    "",
    "## Learn the patterns",
    "",
    `Browse the visual deck at ${SITE.url} — click any card to flip it and see the pattern.`,
    "",
    `© ${SITE.byline} · ${SITE.url}`,
    "",
  ].join("\n");
}

function readme(version) {
  return [
    `# ${SITE.name} Guardrails Kit v${version}`,
    "",
    `${SITE.name} helps vibe coders ship accessible, secure software with great UX.`,
    "",
    `- **Visual deck:** ${SITE.url}`,
    "- **This kit:** agent rules + ship-check skill + human cheat sheet",
    "",
    "Start with [INSTALL.md](INSTALL.md).",
    "",
  ].join("\n");
}

/**
 * @param {import("./load-cards.mjs").CardRecord[]} cards
 * @returns {Map<string, string>}
 */
export function generateKitFiles(cards) {
  /** @type {Map<string, string>} */
  const files = new Map();

  const starterCards = pickCards(cards, STARTER_CARD_IDS);
  const starterBody = starterRuleBody(starterCards);

  files.set(
    `${KIT_ROOT_DIR}/cursor/rules/launchyourvibe-starter.mdc`,
    mdcFile(
      `${SITE.name} Starter Guardrails`,
      `${SITE.name} starter guardrails — highest-impact UX, accessibility, security, and privacy rules for vibe coders`,
      true,
      starterBody,
    ),
  );

  files.set(
    `${KIT_ROOT_DIR}/portable/rules/launchyourvibe-starter.md`,
    `# ${SITE.name} Starter Guardrails\n\n${starterBody}`,
  );

  for (const pack of DOMAIN_PACKS) {
    const domainCards = cards.filter((card) => card.domain === pack.label);
    const body = domainRuleBody(domainCards, pack.label);

    files.set(
      `${KIT_ROOT_DIR}/cursor/rules/${pack.ruleFile}.mdc`,
      mdcFile(
        `${SITE.name} — ${pack.label}`,
        `${SITE.name} ${pack.label} rules — optional domain pack`,
        false,
        body,
      ),
    );

    files.set(
      `${KIT_ROOT_DIR}/portable/rules/${pack.ruleFile}.md`,
      `# ${SITE.name} — ${pack.label}\n\n${body}`,
    );
  }

  const { skillMd, referenceMd } = shipCheckSkill(cards);
  files.set(
    `${KIT_ROOT_DIR}/cursor/skills/launchyourvibe-ship-check/SKILL.md`,
    skillMd,
  );
  files.set(
    `${KIT_ROOT_DIR}/cursor/skills/launchyourvibe-ship-check/reference.md`,
    referenceMd,
  );

  files.set(`${KIT_ROOT_DIR}/reference/launchyourvibe-cheatsheet.md`, cheatsheet(cards));
  files.set(`${KIT_ROOT_DIR}/INSTALL.md`, installGuide());

  return files;
}

/**
 * @param {string} version
 * @param {import("./load-cards.mjs").CardRecord[]} cards
 * @returns {Map<string, string>}
 */
export function generateKitFilesWithReadme(version, cards) {
  const files = generateKitFiles(cards);
  files.set(`${KIT_ROOT_DIR}/README.md`, readme(version));
  return files;
}

export { DOMAIN_BY_LABEL, DOMAIN_PACKS, STARTER_CARD_IDS };
