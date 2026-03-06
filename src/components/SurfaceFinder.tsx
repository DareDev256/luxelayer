"use client";

import { useState } from "react";
import Icon from "./Icon";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

interface SurfaceProfile {
  name: string;
  tagline: string;
  riskLevel: "High" | "Medium" | "Moderate";
  riskColor: string;
  threats: string[];
  protection: string;
}

const profiles: SurfaceProfile[] = [
  {
    name: "Marble",
    tagline: "The diva of countertops — gorgeous but high-maintenance",
    riskLevel: "High",
    riskColor: "text-red-400",
    threats: ["Acid etching from lemon, wine, tomato", "Deep staining from oils", "Scratch-prone polished finish"],
    protection: "Full-surface film with chemical barrier — blocks acid penetration while preserving the natural veining you paid for.",
  },
  {
    name: "Quartz",
    tagline: "Engineered tough, but not invincible",
    riskLevel: "Medium",
    riskColor: "text-amber-400",
    threats: ["Heat marks from hot pans", "Deep scratches from knives", "Resin discoloration over time"],
    protection: "Heat-resistant film rated to 300\u00b0F with self-healing scratch recovery. Your quartz stays factory-fresh.",
  },
  {
    name: "Granite",
    tagline: "Natural stone with a thirst for trouble",
    riskLevel: "High",
    riskColor: "text-red-400",
    threats: ["Oil absorption through pores", "Bacterial growth in micro-fissures", "Dull spots from acidic spills"],
    protection: "Sealed barrier film that eliminates porosity — no more obsessive sealing schedules. One application, years of protection.",
  },
  {
    name: "Quartzite",
    tagline: "Hard as nails, still vulnerable at the surface",
    riskLevel: "Moderate",
    riskColor: "text-yellow-500",
    threats: ["Acid etching despite hardness", "Edge chipping from impact", "Staining in natural fissures"],
    protection: "Thin-profile film that preserves the natural texture while blocking chemical etching. Protection without compromise.",
  },
  {
    name: "Porcelain",
    tagline: "Sleek and modern, fragile at the edges",
    riskLevel: "Medium",
    riskColor: "text-amber-400",
    threats: ["Edge and corner chipping", "Seam vulnerability", "Surface micro-scratches that dull the finish"],
    protection: "Edge-wrap film with impact dampening — protects the most vulnerable points where porcelain is thinnest.",
  },
  {
    name: "Solid Surface",
    tagline: "Seamless look, scratch magnet",
    riskLevel: "High",
    riskColor: "text-red-400",
    threats: ["Visible knife marks within days", "Heat warping from hot cookware", "Staining from dyes and spices"],
    protection: "Self-healing film that absorbs daily abuse — knife marks vanish with gentle heat. Your Corian stays smooth.",
  },
];

export default function SurfaceFinder() {
  const [selected, setSelected] = useState<number | null>(null);
  const profile = selected !== null ? profiles[selected] : null;

  return (
    <Section id="surface-finder" variant="muted" maxWidth="4xl">
      <SectionHeader
        label="Find Your Fit"
        title="What Surface Do You Have?"
        description="Select your countertop material and see exactly what threatens it — and how we protect it."
      />

      {/* Surface selector pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12" role="radiogroup" aria-label="Select your countertop surface type">
        {profiles.map((p, i) => (
          <button
            key={p.name}
            role="radio"
            aria-checked={selected === i}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`
              px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-300
              ${selected === i
                ? "border-gold bg-gold/10 text-gold shadow-[0_0_12px_rgba(201,168,76,0.2)]"
                : "border-white/10 text-warm-gray/50 hover:border-white/25 hover:text-warm-gray/80"
              }
            `}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Result panel */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${profile ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
        aria-live="polite"
      >
        {profile && (
          <div className="border border-gold/15 rounded-lg p-8 bg-[#151515]">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gold">{profile.name}</h3>
                <p className="text-warm-gray/40 text-sm mt-1">{profile.tagline}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${profile.riskColor}`}>
                <Icon name="alert" className="w-3.5 h-3.5" />
                {profile.riskLevel} Risk
              </span>
            </div>

            {/* Two-column layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Threats */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-warm-gray/30 mb-3 font-semibold">Without Protection</h4>
                <ul className="space-y-2.5">
                  {profile.threats.map((threat) => (
                    <li key={threat} className="flex items-start gap-2.5 text-sm text-warm-gray/60">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Protection */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-warm-gray/30 mb-3 font-semibold">LuxeLayer Solution</h4>
                <p className="text-sm text-warm-gray/70 leading-relaxed mb-5">{profile.protection}</p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal bg-gold px-5 py-2.5 rounded hover:bg-gold-light transition-colors duration-200"
                >
                  Get a Quote
                  <Icon name="bolt" className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty state prompt */}
      {!profile && (
        <p className="text-center text-warm-gray/25 text-sm">
          Tap a surface above to see your personalized protection plan
        </p>
      )}
    </Section>
  );
}
