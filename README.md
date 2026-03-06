# LuxeLayer

**Invisible armor for luxury surfaces.** LuxeLayer is the marketing site for a premium countertop protection film service — engineered to convert high-intent visitors into booked consultations.

Built with Next.js 16, React 19, and Tailwind CSS 4. Deployed on Vercel.

---

## Why LuxeLayer Exists

Homeowners spend thousands on exotic granite, marble, and quartz countertops — then watch them scratch, stain, and etch within months. LuxeLayer applies self-healing, crystal-clear protection film that keeps surfaces showroom-fresh for years. The site exists to communicate that value proposition fast and book consultations.

## Features

- **Full landing page** — Hero, Problem/Solution, Services, How It Works, Surface Types, Surface Finder, Gallery, Testimonials, FAQ, and CTA sections
- **Interactive Surface Finder** — Personalized quiz where users select their countertop material and get a tailored risk assessment with protection recommendation and inline CTA. Result panel uses CSS grid row animation for smooth expand *and* collapse transitions. **Two rotation modes**: *Auto* cycles via greedy diversity interleaving; *Diverse* uses a greedy set-cover algorithm scoring candidates across risk level and material type (natural vs engineered) with marginal diversity bonuses (+25 risk, +15 material). Both modes feature per-pill progress bars, a compact **rotation indicator** (SVG progress ring + risk-colored queue dots + pause/play toggle), 2x dwell for high-risk surfaces, automatic pause-on-selection with instant resume-on-deselect, mode-switch cycle reset, and 6s auto-resume fallback
- **Real photography** — Actual project photos of exotic granite countertops, no stock imagery. Gallery captions are always visible on touch devices (mobile-first), hover overlay on desktop
- **Dark luxury aesthetic** — Charcoal/gold palette with intentional typography and spacing
- **Responsive layout** — Mobile-first design that works from 320px to ultrawide
- **SEO-optimized** — Open Graph metadata, semantic HTML, keyword-rich content
- **Active section tracking** — Navigation highlights the current section with a sliding gold underline (desktop) or scaling dot (mobile) using Intersection Observer ratio comparison with race-condition-safe cleanup (ratios Map cleared on effect teardown, comparison scoped to tracked IDs only, referentially stable via serialised key comparison)
- **Scroll-reveal animations** — Intersection Observer-powered directional reveals on every section with expo-out easing and stagger delays
- **Accessible FAQ accordion** — ARIA-compliant expand/collapse with `aria-expanded`, `aria-controls`, `role="region"`, and CSS grid-based height animation
- **Keyboard-accessible mobile menu** — Escape key dismisses the hamburger menu with focus return to the trigger button (WCAG 2.1 SC 2.4.3)
- **Performance-first** — Next.js Image optimization, priority loading on hero, minimal JS bundle, IO-based animations (off main thread)
- **Security-hardened** — Nonce-based CSP via middleware (no `unsafe-inline`/`unsafe-eval` for scripts) with `frame-src`/`child-src`/`manifest-src` lockdown, HSTS with preload, X-Frame-Options DENY, COOP/CORP same-origin (Spectre mitigation), Permissions-Policy, upgrade-insecure-requests; contact form hardened with honeypot field + timing-based bot detection; input validation with pattern constraints and length caps; `/.well-known/security.txt` (RFC 9116) for responsible disclosure
- **76 component tests** — Vitest + Testing Library covering Icon rendering, SurfaceFinder interactions (selection, toggle, mode switching, auto-rotation, ARIA radiogroup), FAQ accordion behavior, and 54 pure-function auto-select tests (diversity ordering, greedy set-cover scoring, multi-dimension bonus weighting, single-category degeneration, uneven bucket interleaving, exact boundary transitions, pipeline integration, schedule computation, cycle progress, boundary wrapping, negative elapsed, zero-dwell safety, short-bonuses crash detection, all-critical/no-critical schedules, weighted dimension ordering)

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Framework   | Next.js 16 (App Router) |
| UI          | React 19             |
| Styling     | Tailwind CSS 4       |
| Language    | TypeScript 5         |
| Testing     | Vitest + Testing Library |
| Deployment  | Vercel               |
| Fonts       | Geist (via next/font) |

## Project Structure

```
src/
  app/
    layout.tsx       # Root layout, metadata, font config
    page.tsx         # Landing page composition
    globals.css      # Tailwind directives, custom properties
  hooks/
    useActiveSection.ts  # IO-based tracker for which section is in view (powers nav highlighting)
    useScrollReveal.ts   # Intersection Observer hook for scroll-triggered visibility
    useRotationCycle.ts  # Timer-driven auto-rotation hook (bridges autoSelect to React state)
  data/
    surfaces.ts          # Surface profile data, types (SurfaceProfile, SurfaceScheduleEntry), dwell config, criticality predicate
  utils/
    autoSelect.ts        # Pure rotation engine — diversityPick, diverseScorePick (greedy set-cover), schedule computation, cycle math
  components/
    Section.tsx      # Layout wrapper — enforces consistent section padding, max-width, and background alternation
    Icon.tsx         # Shared SVG icon library (9 icons, single source of truth)
    SectionHeader.tsx # Shared gold-label/h2/description header — single source of truth
    ScrollReveal.tsx  # Directional reveal wrapper with stagger support
    Button.tsx        # Polymorphic CTA button (primary/ghost, sm/md/lg, <a> or <button>)
    Header.tsx        # Sticky nav
    Hero.tsx         # Full-bleed hero with real photography
    Problem.tsx      # Pain points section
    Services.tsx     # Three service tiers with feature lists
    HowItWorks.tsx   # Step-by-step process
    SurfaceTypes.tsx  # Supported materials
    SurfaceFinder.tsx # Interactive surface quiz (client component)
    Gallery.tsx       # Project photo gallery
    Testimonials.tsx # Customer reviews
    FAQ.tsx          # Common questions
    CTA.tsx          # Final conversion block
    Footer.tsx       # Site footer
public/               # Static assets — served at site root by Next.js
  gallery-1.jpg      # Hero background + gallery (438 KB, real project photo)
  gallery-2.jpg      # Gallery photo (508 KB, real project photo)
  file.svg           # ⚠️ Unused — Create Next App starter asset
  globe.svg          # ⚠️ Unused — Create Next App starter asset
  next.svg           # ⚠️ Unused — Create Next App starter asset
  vercel.svg         # ⚠️ Unused — Create Next App starter asset
  window.svg         # ⚠️ Unused — Create Next App starter asset
```

### How `public/` Works

Next.js serves everything in `public/` from the site root — `public/gallery-1.jpg` becomes `https://luxelayer.vercel.app/gallery-1.jpg`. These files:

- **Bypass the Webpack pipeline** — no content hashing, no tree-shaking, no automatic optimization
- **Are not imported in code** — referenced by URL string (`src="/gallery-1.jpg"`) rather than ES module import
- **Should be optimized before committing** — since Next.js won't process them at build time, compress images manually (TinyPNG, `sharp`, etc.) before adding them here

The two `.jpg` files are real project photographs used in the `Hero` and `Gallery` components via `next/image`, which handles responsive sizing and lazy loading at runtime. The five `.svg` files are leftover Create Next App scaffolding and can be safely removed.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### AI-Assisted Development (Optional)

LuxeLayer's codebase works with [Codex MCP Tool](https://github.com/x51xxx/codex-mcp-tool) — an MCP server that connects Claude Code (or Cursor / Claude Desktop) to OpenAI's Codex CLI for cross-model code analysis, sandboxed execution, and structured refactoring.

**One command to add it:**

```bash
claude mcp add codex-cli -- npx -y @trishchuk/codex-mcp-tool
```

**Prerequisites:** Node.js 18+, [Codex CLI](https://github.com/openai/codex) installed and authenticated (`codex auth`).

Once registered, Claude Code gains access to these MCP tools:

| Tool | What it does |
|------|-------------|
| `ask-codex` | Analyze files via `@` references (e.g. `@src/components/`), select models, run sandboxed edits |
| `brainstorm` | Generate ideas using SCAMPER / design-thinking frameworks |
| `list-sessions` | Manage multi-turn conversation sessions with workspace isolation |
| `health` | Diagnose Codex CLI installation, version, and feature support |

**Example prompts after setup:**

```
explain the architecture of @src/components/SurfaceFinder.tsx
analyze @package.json and suggest dependency updates
use codex sandbox:true to refactor @src/hooks/useActiveSection.ts
```

For Claude Desktop or Cursor, add to your MCP config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "codex-cli": {
      "command": "npx",
      "args": ["-y", "@trishchuk/codex-mcp-tool"]
    }
  }
}
```

See the [codex-mcp-tool README](https://github.com/x51xxx/codex-mcp-tool) for model selection, session management, and local OSS model support.

## Architecture

### Component Composition

The page is a single vertical composition in `page.tsx` — each section is a self-contained component wrapped in `ScrollReveal` for entrance animations. No routing, no shared state beyond the active section tracker:

```
Header (fixed, reads activeSection)
  └─ useActiveSection() ← IO ratio comparison across all section IDs
main
  ├─ Hero (no ScrollReveal — always visible)
  ├─ ScrollReveal > Problem
  ├─ ScrollReveal > Services     (direction="right")
  ├─ ScrollReveal > HowItWorks
  ├─ ScrollReveal > SurfaceTypes (direction="left")
  ├─ ScrollReveal > SurfaceFinder (direction="fade", client component)
  ├─ ScrollReveal > Gallery
  ├─ ScrollReveal > Testimonials (direction="fade")
  ├─ ScrollReveal > FAQ
  └─ ScrollReveal > CTA          (direction="up")
Footer
```

### Intersection Observer Strategy

Two hooks, same API, different jobs:

| Hook | Purpose | Threshold | Lifecycle |
|------|---------|-----------|-----------|
| `useActiveSection` | Track *which* section is most visible | 11 thresholds (0–1 in 0.1 steps) | Persistent — always observing |
| `useScrollReveal` | Track *if* a section has entered view | Single threshold (0.15) | One-shot — unobserves after trigger |

`useActiveSection` uses asymmetric `rootMargin: "-10% 0px -50% 0px"` to bias detection toward the top 40% of the viewport — where the eye naturally rests during scroll. `useScrollReveal` uses `-40px` bottom margin to trigger slightly before the element fully enters.

### Reusable Components

**`Icon`** — Typed SVG icon library with 9 icons (`star`, `shield`, `bolt`, `check`, `alert`, `beaker`, `dollar`, `chevron-down`, `image`). Accepts `name`, `className`, and `strokeWidth`. Renders with `aria-hidden="true"` by default. Automatically handles filled vs. stroked rendering based on the icon type.

**`Section`** — Layout wrapper that enforces consistent section structure: vertical rhythm (`py-24`), horizontal padding (`px-6`), centered max-width container, and background alternation. Accepts `variant` (`"default"` | `"muted"`), `maxWidth` (`"3xl"` | `"4xl"` | `"6xl"`), and `id` for anchor navigation. Uses a static `maxWidthMap` object so Tailwind v4's static analyzer discovers all class names (dynamic template strings get purged).

**`SectionHeader`** — Extracted from 7 section components. Accepts `label` (gold uppercase tag), `title` (h2), and optional `description`. Conditionally removes bottom margin on `h2` when no description follows.

**`ScrollReveal`** — Directional reveal wrapper. Manages `will-change` lifecycle: applies `transform, opacity` hint pre-animation, resets to `auto` post-animation to prevent compositor layer bloat. Uses `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for natural deceleration.

### Custom Color Tokens

Defined in `globals.css` via `@theme inline`, not in a Tailwind config file (Tailwind v4 pattern):

| Token | Value | Usage |
|-------|-------|-------|
| `gold` | `#c9a84c` | Accent, CTAs, active states |
| `gold-light` | `#e2c97e` | Hover states |
| `gold-dark` | `#a88a3a` | Pressed states |
| `charcoal` | `#1a1a1a` | Section backgrounds |
| `charcoal-light` | `#2a2a2a` | Hover backgrounds, borders |
| `warm-gray` | `#f5f0e8` | Body text, headings |
| `cream` | `#faf7f0` | Light accent text |

Background (`--background: #0d0d0d`) is darker than `charcoal` — creates depth between the page base and section containers.

## Design Decisions

**Color palette** — `#0d0d0d` charcoal base with `gold` accents. No gradients on backgrounds — the luxury feel comes from generous whitespace, sharp typography, and real photography doing the heavy lifting.

**Single-page architecture** — This is a conversion-focused landing page, not a content site. One scroll, one CTA, one goal: book a consultation. No routing complexity needed.

**No CMS** — Content changes infrequently. Hardcoded copy keeps the bundle tiny and eliminates external dependencies. When the business scales, a headless CMS can slot in without restructuring.

**Tailwind v4 `@theme inline`** — Color tokens live in `globals.css` instead of a separate config file. This is the Tailwind v4 way — colocates design tokens with the styles that use them, and the `inline` keyword prevents generating unused utility classes.

**`will-change` lifecycle** — Applied *before* animation, removed *after*. Permanent `will-change` promotes elements to compositor layers that eat GPU memory. On a long page with 8+ animated sections, that adds up. The hook manages this automatically.

## License

Private. All rights reserved.
