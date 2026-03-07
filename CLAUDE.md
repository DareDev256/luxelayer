# CLAUDE.md — LuxeLayer

Premium countertop protection film marketing site. Single-page, conversion-focused.
Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript 5. Deployed on Vercel.

## Commands

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build (catches type errors)
npm run lint         # ESLint with next/core-web-vitals + typescript
npm run test         # Vitest — 109 tests, must all pass before commit
npm run test:watch   # Vitest in watch mode
```

**Always run `npm run test && npm run lint` before committing.**

## Architecture

Single vertical landing page — no routing. `page.tsx` composes self-contained section
components wrapped in `ScrollReveal`. No shared state beyond `useActiveSection` (IO-based
nav highlighting).

```
Header (fixed) ← useActiveSection()
main
  Hero → Problem → Services → HowItWorks → SurfaceTypes
  → SurfaceFinder (client) → Gallery → Testimonials → FAQ → CTA
Footer
```

### Key Modules

| Module | Role | Purity |
|--------|------|--------|
| `src/utils/autoSelect.ts` | Rotation engine: `diverseScorePick`, schedule computation, cycle math, `wrapElapsed`, binary-search `activeEntryAt` | Pure functions — zero side effects |
| `src/hooks/useSchedule.ts` | Mode-based schedule builder: selects diversity algorithm, computes rotation schedule | Pure data pipeline — `useMemo` only |
| `src/hooks/useRotationCycle.ts` | Timer hook bridging autoSelect to React state | Stateful — owns `elapsed`, `playing` |
| `src/data/surfaces.ts` | Surface profiles, types, dwell config | Data-only — no imports from components |
| `src/lib/validation.ts` | Isomorphic contact form validation | Pure — runs on client AND server |
| `src/lib/email.ts` | Resend API integration (zero-dep fetch) | Side-effecting — network I/O |
| `src/app/api/contact/route.ts` | Server route: rate limiting + validation + email | Server-only |

### Component Patterns

- **Section components** are server components by default. Only `SurfaceFinder` uses `"use client"`
- **`Section`** wrapper enforces consistent padding, max-width, background alternation
- **`SectionHeader`** is the single source of truth for gold-label/h2/description patterns
- **`Icon`** is a typed SVG library — add icons here, not inline SVGs in components
- **`Button`** is polymorphic — renders `<a>` or `<button>` based on `href` prop
- **`ScrollReveal`** manages `will-change` lifecycle (apply before animation, reset after)

## Code Conventions

### TypeScript
- Strict mode enabled. No `any` — use proper generics or `unknown`
- Path alias: `@/*` maps to `src/*`
- Prefer `interface` for object shapes, `type` for unions/intersections
- Export types alongside their functions (co-location > barrel files)

### Styling
- **Tailwind v4 `@theme inline`** — tokens live in `globals.css`, not a config file
- Color palette: `gold` / `charcoal` / `warm-gray` / `cream` on `#0d0d0d` base
- **No gradients on backgrounds** — luxury feel comes from whitespace and typography
- **No generic card layouts** — every section has intentional, distinct layout
- Use the existing color tokens. Don't introduce new colors without updating the theme

### State Management
- No global state library. Section-local `useState`/`useCallback`/`useMemo` only
- State updaters must be **pure** — no side effects inside `setState(prev => ...)`
- Side effects go in `useEffect`, keyed on the state they respond to
- Memoize callbacks passed to child components (`useCallback` with stable deps)

### Security
- All user input runs through `validateContactForm()` on both client and server
- CSP in `next.config.ts` — no `unsafe-eval`, `frame-ancestors 'none'`
- Rate limiter: sliding-window, 5 req/min/IP, 10K-entry hard cap
- Email body uses `escapeHtml()` on all interpolated fields
- ASCII-only email validation (blocks unicode homoglyph phishing)

## Testing

Vitest + Testing Library. Tests live in `src/__tests__/`. Config: `vitest.config.ts`.

### Test Structure
| File | Covers |
|------|--------|
| `autoSelect.test.ts` | Pure function tests: diverseScorePick, schedule computation, cycle math (55 tests) |
| `validation.test.ts` | Isomorphic validation: XSS, injection, allowlist, truncation (19 tests) |
| `contactRoute.test.ts` | Server-side security: prototype pollution, CRLF, homoglyphs (8 tests) |
| `SurfaceFinder.test.tsx` | Component interactions: selection, rotation, ARIA, mode switching |
| `FAQ.test.tsx` | Accordion behavior, ARIA attributes |
| `Icon.test.tsx` | Icon rendering, prop forwarding |

### Test Conventions
- Pure functions get exhaustive edge-case coverage (empty arrays, NaN, boundary values)
- Component tests use Testing Library queries (`getByRole`, `getByText`) — no `querySelector`
- Security tests verify attack vectors, not just happy paths
- Test file names mirror source: `validation.ts` → `validation.test.ts`

## What NOT to Do

- Don't add routing — this is a single-page conversion site by design
- Don't add a CMS or database — content is hardcoded intentionally
- Don't add global state management (Redux, Zustand, etc.)
- Don't put side effects in React state updaters
- Don't add inline SVGs in section components — add them to `Icon.tsx`
- Don't use `find` or DOM selectors in tests — use Testing Library queries
- Don't commit with failing tests or lint errors
- Don't add stock photography — real project photos only
