"use client";

import type { SurfaceProfile } from "@/data/surfaces";
import Button from "./Button";
import Icon from "./Icon";

interface SurfaceDetailProps {
  profile: SurfaceProfile;
  visible: boolean;
}

/**
 * Expanded detail panel for a selected (or auto-rotated) surface profile.
 *
 * Uses CSS grid-row animation so both expand *and* collapse are smooth —
 * no JS height measurement required. The panel is always mounted; only
 * `grid-template-rows` and `opacity` toggle between 0fr/1fr.
 */
export default function SurfaceDetail({ profile, visible }: SurfaceDetailProps) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
      style={{
        gridTemplateRows: visible ? "1fr" : "0fr",
        opacity: visible ? 1 : 0,
      }}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="overflow-hidden">
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
              <Button
                href="#contact"
                size="md"
                tabIndex={visible ? 0 : -1}
              >
                Get a Quote
                <Icon name="bolt" className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
