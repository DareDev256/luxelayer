# Changelog

All notable changes to LuxeLayer are documented here.

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
