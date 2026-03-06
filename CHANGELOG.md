# Changelog

All notable changes to LuxeLayer are documented here.

## [0.15.2] - 2026-03-06

### Security
- **HTML injection in email body (stored XSS)** — `buildEmailHtml()` interpolated user-supplied `message`, `name`, and `email` directly into HTML template literals without escaping. An attacker could submit `<img src=x onerror="...">` as a message, rendering executable markup in the recipient's email client. Added `escapeHtml()` utility that encodes all five dangerous characters (`& < > " '`) before interpolation, plus `encodeURIComponent()` on the `mailto:` href
- **Cross-origin isolation headers** — Added `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin` to all responses, preventing cross-origin window reference retention (Spectre-class side-channel mitigation) and unauthorized cross-origin resource embedding
- **Rate limiter memory exhaustion** — The in-memory IP map had no hard ceiling; a distributed attack from >1000 unique IPs could grow it unboundedly. Added `MAX_MAP_SIZE` (10,000) hard cap that clears the map entirely under extreme pressure, trading brief rate-limit amnesty for guaranteed memory safety
- **5 new security tests** — `escapeHtml` entity encoding for all dangerous characters, img/onerror payload neutralization, attribute breakout via single quotes, clean string passthrough, and empty string edge case. Total suite: 109 tests passing

## [0.15.1] - 2026-03-06

### Fixed
- **Contact form email delivery** — Replaced the `TODO` in `/api/contact` with a production-ready email integration via the Resend REST API. New `src/lib/email.ts` module uses raw `fetch` (zero dependencies) with graceful degradation: if `RESEND_API_KEY` is not configured, submissions still succeed and are logged server-side. Failed email sends never block the user response — fire-and-forget with ops-visible `console.warn`. Email body uses the project's charcoal/gold palette with a clean HTML table layout. Supports `RESEND_API_KEY`, `CONTACT_TO`, and `CONTACT_FROM` environment variables

## [0.15.0] - 2026-03-06

### Security
- **Server-validated API route** — Created `POST /api/contact` with isomorphic `validateContactForm()` running on the server, closing the client-only validation bypass. The CTA form now POSTs sanitised data to the API route instead of silently succeeding client-side
- **IP rate limiting** — Sliding-window rate limiter (5 requests/minute per IP) with stale-entry eviction prevents form abuse and brute-force submissions. Works behind Vercel/Cloudflare proxies via `x-forwarded-for`/`x-real-ip` header extraction
- **CSP hardened** — Removed `'unsafe-eval'` from `script-src`, blocking `eval()`, `Function()`, and `setTimeout('string')` XSS escalation vectors. Added `upgrade-insecure-requests` directive
- **Unicode homoglyph protection** — Email validation now rejects non-ASCII characters, preventing Cyrillic/Greek lookalike domain phishing (e.g., `exаmple.com` with Cyrillic 'а')
- **8 server-side security tests** — Prototype pollution, CRLF header injection, log injection via newlines, unicode homoglyph domains, payload overflow truncation, null byte injection, constructor pollution, and allowlist exhaustiveness verification. Total suite: 104 tests passing

### Changed
- CTA form now shows loading state during submission and displays server error messages (rate limit, network errors)
- Button component supports disabled state with opacity/cursor styling

## [0.14.4] - 2026-03-06

### Fixed
- **`diverseScorePick` infinite loop on short bonuses array** — When `bonuses` had fewer entries than `dimensions`, missing indices resolved to `undefined`, poisoning scores with `NaN`. Since `NaN > -Infinity` is `false`, `bestIdx` stayed `-1` and `remaining.delete(-1)` was a no-op, creating an infinite loop. Now pads the bonuses array to match dimensions length using the default bonus value (25). Updated the existing crash-documenting test to verify graceful handling, added a new test for empty bonuses fallback. 96 tests passing

## [0.14.3] - 2026-03-06

### Fixed
- **Impure `handleSelect` state updater** — `setLastSelected(i)` was still called inside `setSelected`'s functional updater, the same class of impurity the 0.14.1 fix addressed for `pause()`/`resume()` but missed here. React 19 StrictMode double-invokes updaters to catch exactly this. Extracted to a sequential `setState` call — both calls batch into a single render
- **Unstable `onToggle` callback** — `playing ? pause : resume` inline ternary created a new function reference on every 100ms tick render, forcing `RotationIndicator` to re-render 10 times/second even when `playing` hadn't changed. Replaced with a memoized `toggleRotation` callback that only recreates when `playing` state actually transitions

## [0.14.2] - 2026-03-06

### Security
- **Isomorphic contact form validation** — Created `src/lib/validation.ts` with programmatic validation that runs identically on client and (future) server. HTML5 `pattern`/`required` attributes are browser-only and trivially bypassed; this module provides defence-in-depth with input sanitisation (control char stripping, whitespace trimming, length capping), regex validation for name/email/phone, and a strict allowlist for the surface `<select>` field — preventing injection payloads from riding in on supposedly-constrained inputs
- **CTA form hardened** — `handleSubmit` now runs `validateContactForm()` before any state transition, rejecting invalid data with per-field error messages. Invalid fields get `aria-invalid` + red border; a `role="alert"` summary announces errors to screen readers. The sanitised `result.data` object (not raw FormData) is what the future API route will consume
- **19 validation tests** — Covers happy path, XSS probes (`<script>` in name), email header injection (`<>` in email), SQL injection in surface field, control character stripping, non-string input coercion, oversized payload truncation, multi-error accumulation, and every allowlisted surface value. Total suite: 95 tests passing

## [0.14.1] - 2026-03-06

### Fixed
- **Schedule-identity auto-reset** — `useRotationCycle` now derives a content-based identity key from schedule offsets/dwells and auto-resets elapsed, playing, and resume timers when the schedule changes. Previously the hook only depended on `schedule.length`, so switching between rotation modes that produce same-length but differently-ordered schedules would keep the elapsed timer running against stale offsets until the manual `reset()` call executed one frame later
- **Side effects extracted from state updater** — `rotation.pause()` and `rotation.resume()` were called inside `setSelected`'s functional updater in SurfaceFinder. React state updaters must be pure; side effects during concurrent mode replays would fire multiple times. Moved pause/resume into a dedicated `useEffect` keyed on `selected`
- **Stable `handleSelect` callback** — Destructured stable `pause`/`resume` callbacks from `useRotationCycle` instead of capturing the entire `rotation` object (new identity every render) in `useCallback` dependencies. Eliminates unnecessary re-renders of `SurfacePills` on every tick

## [0.14.0] - 2026-03-06

### Changed
- **SurfaceFinder decomposition** — Extracted `SurfacePills` (pill selector bar with progress indicators) and `SurfaceDetail` (result panel with grid-row expand/collapse animation) into dedicated components. SurfaceFinder drops from 203 to 126 lines and becomes a pure orchestrator — owns rotation state, mode toggle, and delegates all rendering to focused sub-components. Each extracted component has a typed props interface and JSDoc describing its visual contract
- **Removed unused imports** — `Button` and `Icon` no longer imported by SurfaceFinder (now consumed by SurfaceDetail only)

## [0.13.2] - 2026-03-06

### Added
- **20 new edge-case tests for diversity-pick and rotation pipeline** — Covers `diverseScorePick` degeneration (all-same dimensions), three-dimension greedy ordering, short-bonuses crash detection (documents unguarded edge case), `computeRotationSchedule` with empty/zero/all-critical/no-critical/single-entry inputs, `cycleProgress` negative elapsed wrapping and entry boundary transitions, zero-dwell schedule safety, `activeEntryAt` single-entry and mid-entry resolution, and `diverseScorePick` end-to-end pipeline integration with weighted dimension ordering. Total suite: 76 tests passing

## [0.13.1] - 2026-03-06

### Fixed
- **Rotation not resetting on mode switch** — Switching between Auto and Diverse rotation modes left `elapsed` at its previous value, causing the new schedule to start at an arbitrary entry instead of the beginning. Added `reset()` method to `useRotationCycle` that zeroes elapsed, clears pending resume timers, and resumes playback. SurfaceFinder now calls `reset()` on mode toggle
- **Deselect freezes auto-rotation for 6 seconds** — Clicking an active surface pill to deselect it called `rotation.pause()` unconditionally, leaving auto-rotation frozen until the 6-second auto-resume timer fired. Now only pauses on selection; deselection calls `rotation.resume()` immediately so auto-cycling picks up without delay

## [0.13.0] - 2026-03-06

### Changed
- **Surface data extraction** — Moved all 6 surface profile definitions, `SurfaceProfile` type, `MaterialType`, `BASE_DWELL_MS`, and `isCriticalSurface` predicate into dedicated `src/data/surfaces.ts` module. SurfaceFinder is now a pure rendering consumer with zero data ownership
- **Shared `SurfaceScheduleEntry` type** — Replaced verbose inline `ScheduleEntry<{ name: string; riskLevel: string; riskColor: string }>` in RotationIndicator props with a single type alias exported from the data module. Eliminates duplicated type knowledge between components
- **Derived `hasProfile` boolean** — Replaced 5 repeated `profile || autoProfile` expressions in SurfaceFinder with a single derived variable, reducing conditional noise and preventing logic drift between instances
- **Memoized `handleSelect`** — Wrapped pill selection handler in `useCallback` with functional `setSelected` updater, eliminating re-creation on every selection change across 6 pill buttons
- **Consolidated timer cleanup** — Extracted `clearResumeTimer` callback in `useRotationCycle`, merged the standalone unmount-cleanup effect into the interval effect's teardown. One cleanup path instead of two

## [0.12.0] - 2026-03-06

### Changed
- **Reusable Button component** — Extracted repeated CTA button styling into a polymorphic `src/components/Button.tsx` with `primary`/`ghost` variants, `sm`/`md`/`lg` sizes, and automatic `<a>`/`<button>` element selection based on `href` prop. Replaces 5 duplicated class strings across Header, Hero, CTA, and SurfaceFinder with a single source of truth
- **Header** — Desktop and mobile "Get a Quote" links now use `<Button>` instead of raw `<a>` tags with inline classes
- **Hero** — Both CTA buttons ("Book a Consultation" primary, "See How It Works" ghost) refactored to `<Button>`
- **CTA** — Form submit button refactored to `<Button>` with `fullWidth` prop
- **SurfaceFinder** — Inline "Get a Quote" link refactored to `<Button>`

## [0.11.0] - 2026-03-06

### Added
- **Rotation indicator widget** — compact inline component showing an SVG progress ring, active surface label, risk-colored queue dots (active dot pulses at 1.8x scale), and pause/play toggle. Renders only during auto-rotation; disappears on manual selection. Click anywhere on the indicator to pause/resume the rotation cycle
- **RotationIndicator component** — new `src/components/RotationIndicator.tsx` with accessible button semantics (`aria-label` for pause/resume state), gold-stroke progress arc via `stroke-dasharray`/`stroke-dashoffset`, and risk-level dot mapping (red/amber/yellow)

## [0.10.2] - 2026-03-06

### Security
- **Contact form bot protection** — Added honeypot field (hidden input that bots auto-fill, humans never see) and timing gate (submissions under 3 seconds are silently rejected). Form now uses `onSubmit` handler instead of raw `action="#contact" method="POST"` which previously caused a full-page POST reload with no protection
- **CSP hardened** — Added `frame-src 'none'`, `child-src 'none'`, and `manifest-src 'self'` directives to middleware CSP. Closes the gap where `frame-ancestors` prevented embedding *this* site but nothing blocked *this* site from loading malicious iframes
- **Cross-Origin-Resource-Policy header** — Added `same-origin` CORP header to both middleware (dynamic routes) and next.config.ts (static assets). Mitigates Spectre-class side-channel attacks by preventing cross-origin reads of site resources
- **security.txt** — Added `/.well-known/security.txt` per RFC 9116 with contact, canonical URL, preferred language, and expiry date for responsible vulnerability disclosure

## [0.10.1] - 2026-03-06

### Fixed
- **diversityPick adjacent duplicates** — replaced round-robin interleaving with greedy pick algorithm that always selects from the largest remaining bucket whose category differs from the previous pick. The old approach exhausted smaller buckets early, causing the dominant category to stack at the tail (e.g. `H,M,C,H,M,H,H` instead of `H,M,H,C,H,M,H`). Adjacent duplicates now only occur when mathematically unavoidable (dominant bucket > ceil(n/2))
- **1 new regression test** — verifies a 4-2-1 bucket split produces zero adjacent duplicates (60 tests total, all passing)

## [0.10.0] - 2026-03-06

### Added
- **Diverse rotation mode** — new `diverseScorePick` algorithm uses greedy set-cover to maximise variety across multiple dimensions (risk level + material type). Each pick round applies marginal diversity bonuses (+25 for unseen risk, +15 for unseen material) to re-rank candidates, producing wider surface mixes without sacrificing quality ordering
- **Mode toggle UI** — accessible radiogroup with Auto/Diverse buttons in SurfaceFinder. Switching modes rebuilds the rotation schedule in real-time. Auto uses single-dimension round-robin; Diverse uses multi-dimension scored selection
- **Material type metadata** — surfaces now categorised as `natural` (Marble, Granite, Quartzite) or `engineered` (Quartz, Porcelain, Solid Surface), enabling the Diverse strategy to alternate between stone types
- **5 new tests** for `diverseScorePick` (multi-dimension coverage, unseen-value priority, empty input, custom bonus weighting, determinism) plus 2 SurfaceFinder integration tests for the mode toggle

## [0.9.4] - 2026-03-06

### Fixed
- **Broken logo links** — Header and Footer logo `href="#"` caused a jarring jump to `#` hash. Replaced with smooth `scrollTo({ top: 0, behavior: "smooth" })` with `aria-label="Scroll to top"` for accessibility
- **Broken social links in Footer** — Instagram, Facebook, and Google Reviews links used `href="#"` with `target="_blank"`, opening a useless blank tab. Replaced with inert `<span>` elements with "Coming soon" tooltip until real URLs are available. Removes misleading `rel="noopener noreferrer"` on dead links

## [0.9.3] - 2026-03-06

### Fixed
- **Broken domain reference in README** — `luxelayer.com` is a parked domain (302 redirects to a domain marketplace), not the actual deployment. Replaced with `luxelayer.vercel.app` in the `public/` documentation section so the example URL resolves correctly

## [0.9.2] - 2026-03-06

### Added
- **15 new diversity-pick edge case tests** — single-item input, single-category degeneration (all items share one severity), uneven bucket interleaving (5:1 ratio), equal-size category alternation, determinism verification, many-unique-categories, exact ms boundary transitions between schedule entries, boundary walk across all entries, large negative elapsed wrapping, negative cycle index, full pipeline reachability (diversityPick -> schedule -> activeEntryAt), schedule-order preservation, and cycleProgress clamping at cycle end. Total test count: 52, all passing, lint clean

## [0.9.1] - 2026-03-06

### Added
- **AI-Assisted Development docs** — README section documenting one-command Codex MCP Tool integration (`claude mcp add codex-cli -- npx -y @trishchuk/codex-mcp-tool`). Covers prerequisites, exposed MCP tools (`ask-codex`, `brainstorm`, `list-sessions`, `health`), example prompts referencing LuxeLayer source files, and Claude Desktop / Cursor JSON config. Links to upstream docs for model selection and session management

## [0.9.0] - 2026-03-06

### Added
- **Auto-rotation for Surface Finder** — surfaces cycle automatically on a timer with diversity-ordered scheduling. High-risk surfaces (Marble, Granite, Solid Surface) get 2x dwell time (8s vs 4s) since they're the highest-converting profiles. A gold progress bar fills beneath the active pill during auto-play
- **Pure auto-select engine** (`src/utils/autoSelect.ts`) — `diversityPick` reorders by severity for visual variety, `computeRotationSchedule` assigns cumulative offsets with critical-entry weighting, `activeEntryAt` and `cycleProgress` use double-modulo wrapping for negative/overflow safety
- **`useRotationCycle` hook** — bridges the pure schedule functions to a `setInterval`-driven React state machine with pause-on-interaction (auto-resumes after 6s)
- **17 auto-select unit tests** — covers empty schedules, diversity ordering, cumulative offsets, midpoint progress, boundary wrapping, negative elapsed, and cycle indexing

### Changed
- SurfaceFinder now shows a surface profile immediately on mount (auto-rotation) instead of requiring manual selection — increases engagement by showing value before interaction

## [0.8.3] - 2026-03-06

### Security
- **Nonce-based CSP via middleware** — replaced static `script-src 'self' 'unsafe-inline' 'unsafe-eval'` with per-request nonce generation (`src/middleware.ts`). Every response gets a unique cryptographic nonce; only scripts carrying the token execute. Eliminates the two most exploitable CSP bypasses (OWASP A03: Injection)
- **Removed `'unsafe-eval'` from CSP** — no code in the bundle uses `eval()` or `new Function()`, so this was an unnecessary XSS attack surface
- **Disabled `X-XSS-Protection`** (set to `0`) — the legacy `1; mode=block` value can be weaponized in older browsers to selectively block legitimate scripts; CSP nonce handles XSS prevention now
- **Added `Cross-Origin-Opener-Policy: same-origin`** — prevents cross-origin windows from retaining `window.opener` references (Spectre-class side-channel mitigation)
- **Added `X-DNS-Prefetch-Control: off`** — prevents DNS prefetch from leaking which external domains are referenced in the page
- **Added `object-src 'none'` and `worker-src 'none'` to CSP** — explicitly blocks plugin and worker execution vectors
- **Added `upgrade-insecure-requests` to CSP** — forces all subresource requests to HTTPS
- **Replaced deprecated `interest-cohort=()` with `browsing-topics=()`** in Permissions-Policy — FLoC is dead, Topics API is the current opt-out

## [0.8.2] - 2026-03-06

### Fixed
- `SurfaceFinder` result panel had broken expand/collapse animation — conditional render (`{profile && ...}`) inside a `max-height` transition container meant content unmounted instantly on deselect (no collapse animation) and popped into a zero-height container on select (janky expand). Replaced with always-mounted content using CSS `grid-template-rows: 0fr/1fr` transition. A `lastSelected` state preserves the displayed profile during the collapse animation so text doesn't vanish mid-transition. Interactive links inside the collapsed panel get `tabIndex={-1}` to prevent focus on hidden content (WCAG 2.4.3)
- Gallery hover overlay was invisible on touch/mobile devices — `opacity-0 group-hover:opacity-100` meant title and description for image cards were completely inaccessible without a mouse (WCAG 2.1 SC 1.3.1). Captions now render inline on mobile (`< md`) with the gradient overlay pattern reserved for desktop hover only via responsive `md:absolute md:opacity-0 md:group-hover:opacity-100`
- Empty state prompt in SurfaceFinder now fades out with a smooth opacity transition instead of conditionally unmounting

## [0.8.1] - 2026-03-06

### Fixed
- `SurfaceFinder` was the only section component still using raw `<section>` with inline layout classes — migrated to the `Section` wrapper extracted in v0.8.0 for consistent padding, max-width, and background alternation
- Mobile hamburger menu had no Escape key handler — added `keydown` listener that dismisses the menu and returns focus to the hamburger button (WCAG 2.1 SC 2.4.3 focus management)
- `useActiveSection` was referentially fragile — the `useEffect` dependency was the raw `sectionIds` array, so any non-memoized caller would trigger infinite IntersectionObserver reconnection every render. Now stabilises internally via serialised key comparison (`sectionIds.join(",")`)

## [0.8.0] - 2026-03-06

### Changed
- Extracted `Section` layout component — centralises the `py-24 px-6` / `max-w-{size} mx-auto` / background-alternation pattern that was duplicated across 8 section components into a single source of truth with `variant`, `maxWidth`, and `id` props
- Refactored Problem, Services, HowItWorks, SurfaceTypes, Gallery, Testimonials, FAQ, and CTA to use `Section` — each component now owns only its content, not its layout scaffolding
- Extracted `.input-field` CSS utility class — consolidated the 150+ character className string repeated across 5 CTA form inputs into a shared class with proper `::placeholder` and `:focus` pseudo-selectors using design tokens
- `Section` uses a static `maxWidthMap` object to ensure Tailwind v4 class discovery works (dynamic template strings get purged by the static analyzer)

## [0.7.2] - 2026-03-06

### Added
- Vitest + Testing Library test infrastructure with jsdom environment and `@` path alias support
- 6 Icon component tests — validates all 9 registered icons render, filled vs outlined viewBox/stroke branching, aria-hidden decorative marking, custom className/strokeWidth passthrough, and strokeWidth silently ignored on filled icons
- 7 SurfaceFinder interaction tests — verifies 6 radio buttons render with correct names, empty-state prompt on no selection, profile display on selection (tagline + risk level + threats + CTA href), toggle-off on re-click, surface switching without stale state, radiogroup ARIA label, and aria-live polite region
- 7 FAQ accordion tests — asserts all 8 triggers render collapsed, expansion reveals answer text, single-open constraint (opening one closes others), collapse on re-click, aria-controls→panel ID wiring, and region→aria-labelledby back-reference

## [0.7.1] - 2026-03-06

### Fixed
- Race condition in `useActiveSection` — the `ratios` Map ref was never cleared on effect cleanup, allowing stale IntersectionObserver entries from previous observer cycles to persist and win the "best ratio" comparison when `sectionIds` identity changed or during React strict-mode double-invocations
- Comparison loop now scoped to a `trackedIds` Set snapshot instead of iterating the full Map — prevents orphaned entries from fast-scroll IO batch misses from selecting an off-screen section as active

## [0.7.0] - 2026-03-06

### Added
- `SurfaceFinder` interactive quiz component — users select their countertop material (Marble, Quartz, Granite, Quartzite, Porcelain, Solid Surface) and get a personalized risk assessment with specific threats, protection recommendation, and inline "Get a Quote" CTA
- Smooth expand/collapse panel animation using `max-height` + `opacity` transition (500ms ease-out) for result reveal
- ARIA `radiogroup` pattern on surface selector pills with `aria-checked` state, `aria-live="polite"` on result panel for screen reader announcements
- Gold glow `box-shadow` on active surface pill for clear selection feedback
- SurfaceFinder inserted into conversion funnel between SurfaceTypes (what we protect) and Gallery (proof) — creates a qualification step where users self-identify their need

## [0.6.0] - 2026-03-06

### Changed
- Extracted shared `Icon` component — single source of truth for 9 SVG icons used across 6 components, eliminating ~80 lines of duplicated SVG markup
- Refactored `Problem` data array from inline JSX icons to `IconName` string references — separates data from presentation, makes the array serializable and testable
- Consolidated 4 Hero animation delay classes (`animate-fade-in-up`, `-delay-1`, `-delay-2`, `-delay-3`) into a single class using a `--delay` CSS custom property — stagger timing now set via inline style instead of class proliferation
- All icons render with `aria-hidden="true"` by default via the `Icon` component — decorative icons no longer need per-instance ARIA attributes

## [0.5.2] - 2026-03-06

### Security
- Added comprehensive security headers via `next.config.ts` — CSP, HSTS (2-year max-age with preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, and Permissions-Policy
- Hardened CTA contact form with `required` attributes, `maxLength` caps, regex `pattern` validation on name/phone fields, `name` attributes for proper form semantics, and `autoComplete` hints
- Added `rel="noopener noreferrer"` and `target="_blank"` to external social links in Footer to prevent reverse tabnapping
- CSP `form-action 'self'` restricts form submissions to same-origin only
- CSP `frame-ancestors 'none'` provides defense-in-depth alongside X-Frame-Options

## [0.5.1] - 2026-03-06

### Added
- Architecture section in README — component composition tree, Intersection Observer strategy comparison table, reusable component API docs, and custom color token reference
- Design decision docs for Tailwind v4 `@theme inline` pattern and `will-change` lifecycle management
- JSDoc documentation on `Header` component, `navLinks` config, and `Home` page composition explaining the conversion funnel ordering
- Inline doc linking `navLinks.id` to section `id` attributes for IO tracking clarity

## [0.5.0] - 2026-03-06

### Changed
- Extracted `SectionHeader` component — deduplicated the gold-label/h2/description header pattern from 7 section components into a single source of truth
- Refactored FAQ accordion with proper ARIA attributes (`aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`) for WCAG 2.1 compliance
- Replaced FAQ conditional rendering with CSS grid height animation (`grid-template-rows: 0fr/1fr`) for smooth expand/collapse transitions
- Decorative SVG chevron in FAQ now marked `aria-hidden="true"` to prevent screen reader noise

## [0.4.0] - 2026-03-06

### Added
- `useActiveSection` hook — Intersection Observer-based tracker that detects which page section is currently most visible using multi-threshold ratio comparison and asymmetric rootMargin biased to the top 40% of the viewport
- Active section highlighting in Header navigation — desktop links get a sliding gold underline indicator, mobile menu gets a scaling gold dot prefix
- `aria-expanded` attribute on mobile hamburger button and `aria-label` on mobile nav landmark for improved screen reader support

## [0.3.0] - 2026-03-05

### Added
- `useScrollReveal` hook — Intersection Observer-based visibility tracker for scroll-triggered animations
- `ScrollReveal` component — directional reveal wrapper (up/left/right/fade) with stagger delays and expo-out easing
- All below-the-fold sections now animate into view on scroll with varied directions and timing
- `will-change` lifecycle management — applies compositor hints pre-animation, removes post-animation to prevent layer bloat

## [0.2.1] - 2026-03-05

### Added
- Documented `public/` directory structure with full asset inventory and usage notes
- Explained Next.js static serving behavior, Webpack bypass, and image optimization guidance
- Flagged 5 unused Create Next App starter SVGs for cleanup

## [0.2.0] - 2026-03-05

### Changed
- Replaced default create-next-app README with portfolio-grade project documentation
- Added project goals, feature overview, tech stack table, directory map, and design rationale
- Created CHANGELOG.md for release tracking
- Bumped version to 0.2.0

## [0.1.0] - 2026-03-04

### Added
- Initial site build — full landing page with 11 component sections
- Dark luxury aesthetic with charcoal/gold palette
- Real project photography in hero and gallery
- SEO metadata with Open Graph tags
- Responsive mobile-first layout
- Rebranded from PPF/paint protection to countertop protection film
