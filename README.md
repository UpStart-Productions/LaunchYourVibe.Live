# LaunchYourVibe

**AI doesn't catch everything.** Reference cards for vibe coders who want to ship secure, accessible apps with great UX.

Live at **[launchyourvibe.live](https://launchyourvibe.live)** · Built by [UpStart Productions](https://heyupstart.com)

---

## What this is

LaunchYourVibe is a browsable deck of **90 flip-card references** across six UX domains. Each card shows a visual pattern on the front and a concise rule on the back — the kind of practical guidance AI assistants often miss or get wrong.

It's aimed at people who ship with AI but still want the vocabulary and instincts to make software feel right: spacing, interaction, components, navigation, accessibility, and data presentation.

The card system is adapted from the [UpStart UX Deck](https://heyupstart.com).

## Features

- **Flip cards** — click any card to reveal the rule on the back
- **Animated visuals** — hover-driven on desktop; scroll-into-view on touch devices (decoupled from flip so mobile doesn't glitch)
- **Search & filter** — full-text search plus jump-to-category navigation
- **Permalinks** — every card has a shareable URL (`/card/t-01`, `/card/i-11`, …) and a copy-link button on the card front
- **Single-card view** — permalink pages show one card centered on the cosmic background
- **Static & fast** — fully pre-rendered Astro site with sitemap generation

## The six domains

| Prefix | Domain | Cards | Color |
|--------|--------|-------|-------|
| **T** | Spacing & Typography | T-01 … T-15 | Blue |
| **I** | Interaction | I-01 … I-15 | Orange |
| **C** | Components | C-01 … C-15 | Green |
| **N** | Navigation | N-01 … N-15 | Purple |
| **A** | Accessibility | A-01 … A-15 | Amber |
| **D** | Data | D-01 … D-15 | Red |

## Tech stack

- [Astro 5](https://astro.build) — static site generation
- [Tailwind CSS 4](https://tailwindcss.com) — layout, cosmic theme, page chrome
- [ux-deck.css](src/styles/ux-deck.css) — self-contained card system (flip mechanics, visuals, animations)
- [Lucide](https://lucide.dev) icons via `lucide-astro`
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — SEO sitemap (post-processed to `/sitemap.xml`)
- Deployed on **AWS Amplify** (Node 20)

## Getting started

**Requirements:** Node 20+

```bash
npm install
npm run dev        # http://localhost:4321
```

Other scripts:

```bash
npm run build      # static output → dist/
npm run preview    # serve the production build locally
npm run check      # Astro type/content checks
```

## Project structure

```
src/
├── components/
│   ├── UxCard.astro          # Flip-card wrapper (front, back, permalink button)
│   ├── CardDeckScripts.astro # Flip, copy-link, scroll/hover animations
│   ├── SearchBar.astro       # Search + category picker
│   ├── cards/                # One file per card (T01.astro → id "T-01")
│   └── …                     # Header, Footer, QuickNav, etc.
├── config/
│   ├── site.ts               # Site name, URL, UpStart link
│   └── cards.ts              # Auto-registry via import.meta.glob (permalinks)
├── layouts/
│   └── BaseLayout.astro      # HTML shell, meta, fonts, analytics
├── pages/
│   ├── index.astro           # Main deck (all 90 cards)
│   └── card/[id].astro       # Single-card permalink pages
└── styles/
    ├── global.css            # Tailwind + cosmic theme tokens
    └── ux-deck.css           # Card deck styles & animations
```

## Adding a new card

1. **Create the card file** in `src/components/cards/`, named `{Letter}{NN}.astro` (e.g. `T16.astro`):

```astro
---
import UxCard from "../UxCard.astro";
---

<UxCard
  id="T-16"
  domain="Spacing & Typography"
  domainClass="d-t"
  title="Your Title Here"
  rule="<strong>Lead with the insight.</strong> Supporting detail goes here."
>
  <!-- Visual demo markup inside .card-visual -->
  <div class="t16-visual">…</div>
</UxCard>
```

2. **Add card-specific CSS** to `src/styles/ux-deck.css` if the visual needs custom animation (follow existing `t01-visual`, `card-wrap.is-animated` patterns). Use the deck typography tokens (`--deck-text-*`, `--deck-font-*`) for any new type — do not add raw `font-size` or `font-family` values.

### Deck typography tokens

All card-face type is defined once at the top of `src/styles/ux-deck.css`:

| Token | Size | Typical use |
|-------|------|-------------|
| `--deck-font-sans` | Inter | Card titles, demo body |
| `--deck-font-mono` | IBM Plex Mono | Labels, code, annotations |
| `--deck-text-2xs` | 10px | Copy feedback (footer only) |
| `--deck-text-xs` | 12px | Verdict labels, section caps (WCAG minimum) |
| `--deck-text-sm` | 13px | Default demo + mono body |
| `--deck-text-md` | 14px | Inputs, emphasis body |
| `--deck-text-lg` | 15px | Demo headings |
| `--deck-text-xl` | 16px | Large demo type |
| `--deck-text-2xl` | 17px | Error headings |
| `--deck-text-3xl` | 18px | Card face title |
| `--deck-text-display` | 20px | Hero demo type |
| `--deck-text-hero` | 24px | KPI numbers, large icons |
| `--deck-text-icon` | 28px | Icon glyphs |

Shared mono label styles live in the `mono typography bases` section; color and spacing stay on per-class rules.

### Deck color tokens

Text, status (good/bad/info), domain accents, backgrounds, and borders each have a `--deck-color-*` or `--deck-bg-*` / `--deck-border-*` token at the top of `ux-deck.css`. Common ones:

| Token | Role |
|-------|------|
| `--deck-color-text` / `--deck-color-heading` | Body and titles |
| `--deck-color-secondary` / `--deck-color-label` | Muted demo copy (AA-safe) |
| `--deck-color-good` / `--deck-color-bad` / `--deck-color-info` | Semantic labels |
| `--deck-color-good-strong` / `--deck-color-bad-strong` | Text on tinted panels |
| `--deck-bg-good` / `--deck-bg-bad` | Good/bad demo panels |
| `--deck-color-type` / `--deck-color-interaction` / … | Domain accent colors |

Do not add raw hex to card utilities; extend the token list if a new color is needed.

3. **Register on the homepage** — import the component in `src/pages/index.astro` and place it in the appropriate domain grid.

4. **Permalink page** — no extra work. `src/config/cards.ts` picks up new files via glob and `getStaticPaths` generates `/card/t-16` at build time.

### Domain class reference

| Class | Domain |
|-------|--------|
| `d-t` | Spacing & Typography |
| `d-i` | Interaction |
| `d-c` | Components |
| `d-n` | Navigation |
| `d-a` / `a-a` | Accessibility |
| `d-d` | Data |

## How the card interactions work

| Interaction | Desktop | Touch |
|-------------|---------|-------|
| Visual demos | `mouseenter` adds `.is-animated` | `IntersectionObserver` when card enters viewport; resets when it leaves |
| Flip | Click anywhere except `data-no-flip` controls | Same |
| Copy link | Link icon in front footer → clipboard + "Card Link Copied" | Same |

Flip and copy-link logic live in `CardDeckScripts.astro`. Interactive elements (copy button, UpStart logo on card back) are marked `data-no-flip` so they don't trigger a flip. Hidden card faces use `pointer-events: none` so clicks pass through correctly.

## Build & deploy

Production build:

```bash
npm run build
```

This runs `astro build` then `scripts/finalize-sitemap.mjs`, which renames `sitemap-index.xml` → `sitemap.xml` for crawler compatibility.

**AWS Amplify** (`amplify.yml`):

- Node 20 via `nvm use 20`
- `npm ci` → `npm run build`
- Artifacts served from `dist/`

## Configuration

Site-wide settings in `src/config/site.ts`:

```ts
export const SITE = {
  name: "LaunchYourVibe",
  tagline: "Reference cards for vibe coders who ship",
  url: "https://launchyourvibe.live",
  byline: "by UpStart Productions",
  upstartUrl: "https://heyupstart.com",
} as const;
```

Canonical URL and sitemap base are set in `astro.config.mjs` (`site: "https://launchyourvibe.live"`).

## License & credits

Card content and visual system adapted from the UpStart UX Deck.

© [UpStart Productions](https://heyupstart.com)
