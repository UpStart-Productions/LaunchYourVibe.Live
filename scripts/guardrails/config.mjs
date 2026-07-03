/** @typedef {{ slug: string; label: string; ruleFile: string }} DomainPack */

export const SITE = {
  name: "LaunchYourVibe",
  url: "https://launchyourvibe.live",
  byline: "UpStart Productions",
};

/** Highest-impact cards for always-on starter rules (~28). */
export const STARTER_CARD_IDS = [
  "A-04",
  "A-09",
  "A-10",
  "A-14",
  "A-05",
  "I-03",
  "I-12",
  "I-15",
  "I-02",
  "N-01",
  "N-02",
  "C-11",
  "C-14",
  "C-01",
  "S-01",
  "S-02",
  "S-03",
  "S-07",
  "S-10",
  "P-01",
  "P-03",
  "P-08",
  "P-12",
  "D-04",
  "D-07",
  "T-02",
  "T-14",
  "T-06",
];

/** Optional explicit triggers for starter rules (agent-native "when"). */
export const STARTER_TRIGGERS = {
  "A-04": "Creating icon-only buttons or controls with no visible text label",
  "A-09": "Adding form inputs, search fields, or any text field",
  "A-10": "Showing validation errors, helper text, or inline field feedback",
  "A-14": "Naming interactive elements for screen readers (buttons, links, inputs)",
  "A-05": "Choosing HTML elements (buttons, links, headings, landmarks) for structure",
  "I-03": "Loading data, fetching content, or waiting on async operations",
  "I-12": "Adding hover-only actions, tooltips, or menus that reveal on pointer hover",
  "I-15": "Adding phone, email, number, or other typed input fields",
  "I-02": "Designing click/tap targets, buttons, or touch-friendly controls",
  "N-01": "Rendering empty lists, dashboards, inboxes, or zero-result states",
  "N-02": "Choosing between a modal/dialog and a new page or route",
  "C-11": "Showing alerts, banners, toasts, or status messages",
  "C-14": "Relying on tooltips to explain how a control works",
  "C-01": "Building primary/secondary actions or button hierarchies",
  "S-01": "Handling authentication, login, or session management",
  "S-02": "Storing secrets, API keys, or credentials in code or config",
  "S-03": "Protecting routes, APIs, admin actions, or sensitive data",
  "S-07": "Persisting auth tokens (JWT, session) in the browser",
  "S-10": "Rendering user-generated or untrusted HTML/content",
  "P-01": "Designing forms, schemas, or data collection flows",
  "P-03": "Email signup, newsletters, or marketing opt-in flows",
  "P-08": "Storing passwords, tokens, or PII in a database",
  "P-12": "Planning database columns, user profiles, or analytics fields",
  "D-04": "Building charts or graphs with axes",
  "D-07": "Choosing between a chart and a table for numeric data",
  "T-02": "Setting spacing, margins, padding, or layout gaps",
  "T-14": "Building mobile layouts or full-bleed UI near device edges",
  "T-06": "Deciding between padding and margin on components",
};

/** @type {DomainPack[]} */
export const DOMAIN_PACKS = [
  {
    slug: "spacing-typography",
    label: "Spacing & Typography",
    ruleFile: "launchyourvibe-spacing-typography",
  },
  {
    slug: "interaction",
    label: "Interaction",
    ruleFile: "launchyourvibe-interaction",
  },
  {
    slug: "components",
    label: "Components",
    ruleFile: "launchyourvibe-components",
  },
  {
    slug: "navigation",
    label: "Navigation",
    ruleFile: "launchyourvibe-navigation",
  },
  {
    slug: "accessibility",
    label: "Accessibility",
    ruleFile: "launchyourvibe-accessibility",
  },
  { slug: "data", label: "Data", ruleFile: "launchyourvibe-data" },
  { slug: "security", label: "Security", ruleFile: "launchyourvibe-security" },
  { slug: "privacy", label: "Privacy", ruleFile: "launchyourvibe-privacy" },
];

export const DOMAIN_BY_LABEL = Object.fromEntries(
  DOMAIN_PACKS.map((pack) => [pack.label, pack]),
);

export const KIT_ROOT_DIR = "launchyourvibe-guardrails";
