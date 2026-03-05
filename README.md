# LuxeLayer

**Invisible armor for luxury surfaces.** LuxeLayer is the marketing site for a premium countertop protection film service — engineered to convert high-intent visitors into booked consultations.

Built with Next.js 16, React 19, and Tailwind CSS 4. Deployed on Vercel.

---

## Why LuxeLayer Exists

Homeowners spend thousands on exotic granite, marble, and quartz countertops — then watch them scratch, stain, and etch within months. LuxeLayer applies self-healing, crystal-clear protection film that keeps surfaces showroom-fresh for years. The site exists to communicate that value proposition fast and book consultations.

## Features

- **Full landing page** — Hero, Problem/Solution, Services, How It Works, Surface Types, Gallery, Testimonials, FAQ, and CTA sections
- **Real photography** — Actual project photos of exotic granite countertops, no stock imagery
- **Dark luxury aesthetic** — Charcoal/gold palette with intentional typography and spacing
- **Responsive layout** — Mobile-first design that works from 320px to ultrawide
- **SEO-optimized** — Open Graph metadata, semantic HTML, keyword-rich content
- **Performance-first** — Next.js Image optimization, priority loading on hero, minimal JS bundle

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Framework   | Next.js 16 (App Router) |
| UI          | React 19             |
| Styling     | Tailwind CSS 4       |
| Language    | TypeScript 5         |
| Deployment  | Vercel               |
| Fonts       | Geist (via next/font) |

## Project Structure

```
src/
  app/
    layout.tsx       # Root layout, metadata, font config
    page.tsx         # Landing page composition
    globals.css      # Tailwind directives, custom properties
  components/
    Header.tsx       # Sticky nav
    Hero.tsx         # Full-bleed hero with real photography
    Problem.tsx      # Pain points section
    Services.tsx     # Three service tiers with feature lists
    HowItWorks.tsx   # Step-by-step process
    SurfaceTypes.tsx # Supported materials
    Gallery.tsx      # Project photo gallery
    Testimonials.tsx # Customer reviews
    FAQ.tsx          # Common questions
    CTA.tsx          # Final conversion block
    Footer.tsx       # Site footer
public/
  gallery-1.jpg      # Hero + gallery photography
  gallery-2.jpg      # Additional project photo
```

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

## Design Decisions

**Color palette** — `#0d0d0d` charcoal base with `gold` accents. No gradients on backgrounds — the luxury feel comes from generous whitespace, sharp typography, and real photography doing the heavy lifting.

**Single-page architecture** — This is a conversion-focused landing page, not a content site. One scroll, one CTA, one goal: book a consultation. No routing complexity needed.

**No CMS** — Content changes infrequently. Hardcoded copy keeps the bundle tiny and eliminates external dependencies. When the business scales, a headless CMS can slot in without restructuring.

## License

Private. All rights reserved.
