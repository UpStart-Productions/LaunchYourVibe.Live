export type CardSeoFields = {
  id: string;
  domain: string;
  title: string;
  rule: string;
};

const META_DESCRIPTION_MAX = 160;

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateMeta(text: string, max = META_DESCRIPTION_MAX): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${trimmed}…`;
}

export function cardPageTitle(card: CardSeoFields, siteName: string): string {
  return `${stripHtml(card.title)} (${card.domain}) — ${siteName}`;
}

export function cardPageDescription(card: CardSeoFields, siteName: string): string {
  const lead = `${card.id} · ${card.domain}.`;
  const rule = stripHtml(card.rule);
  const body = truncateMeta(rule, META_DESCRIPTION_MAX - lead.length - 1);
  return `${lead} ${body} · ${siteName}`;
}

export function parseUxCardMeta(source: string): Pick<CardSeoFields, "domain" | "title" | "rule"> {
  const match = source.match(/<UxCard[\s\S]*?\n>/);
  if (!match) {
    throw new Error("UxCard opening tag not found");
  }

  const tag = match[0];
  const getAttr = (name: string): string => {
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
