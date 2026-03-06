/**
 * Surface profile data — the single source of truth for countertop
 * materials, risk levels, threats, and protection descriptions.
 *
 * Separated from UI so profile additions/edits are data-only changes
 * with zero rendering risk.
 */

import type { ScheduleEntry } from "@/utils/autoSelect";

export type MaterialType = "natural" | "engineered";

export interface SurfaceProfile {
  name: string;
  tagline: string;
  riskLevel: "High" | "Medium" | "Moderate";
  riskColor: string;
  materialType: MaterialType;
  threats: string[];
  protection: string;
}

/** Schedule entry pre-bound to SurfaceProfile shape. */
export type SurfaceScheduleEntry = ScheduleEntry<SurfaceProfile>;

export const profiles: SurfaceProfile[] = [
  {
    name: "Marble",
    tagline: "The diva of countertops — gorgeous but high-maintenance",
    riskLevel: "High",
    riskColor: "text-red-400",
    materialType: "natural",
    threats: ["Acid etching from lemon, wine, tomato", "Deep staining from oils", "Scratch-prone polished finish"],
    protection: "Full-surface film with chemical barrier — blocks acid penetration while preserving the natural veining you paid for.",
  },
  {
    name: "Quartz",
    tagline: "Engineered tough, but not invincible",
    riskLevel: "Medium",
    riskColor: "text-amber-400",
    materialType: "engineered",
    threats: ["Heat marks from hot pans", "Deep scratches from knives", "Resin discoloration over time"],
    protection: "Heat-resistant film rated to 300\u00b0F with self-healing scratch recovery. Your quartz stays factory-fresh.",
  },
  {
    name: "Granite",
    tagline: "Natural stone with a thirst for trouble",
    riskLevel: "High",
    riskColor: "text-red-400",
    materialType: "natural",
    threats: ["Oil absorption through pores", "Bacterial growth in micro-fissures", "Dull spots from acidic spills"],
    protection: "Sealed barrier film that eliminates porosity — no more obsessive sealing schedules. One application, years of protection.",
  },
  {
    name: "Quartzite",
    tagline: "Hard as nails, still vulnerable at the surface",
    riskLevel: "Moderate",
    riskColor: "text-yellow-500",
    materialType: "natural",
    threats: ["Acid etching despite hardness", "Edge chipping from impact", "Staining in natural fissures"],
    protection: "Thin-profile film that preserves the natural texture while blocking chemical etching. Protection without compromise.",
  },
  {
    name: "Porcelain",
    tagline: "Sleek and modern, fragile at the edges",
    riskLevel: "Medium",
    riskColor: "text-amber-400",
    materialType: "engineered",
    threats: ["Edge and corner chipping", "Seam vulnerability", "Surface micro-scratches that dull the finish"],
    protection: "Edge-wrap film with impact dampening — protects the most vulnerable points where porcelain is thinnest.",
  },
  {
    name: "Solid Surface",
    tagline: "Seamless look, scratch magnet",
    riskLevel: "High",
    riskColor: "text-red-400",
    materialType: "engineered",
    threats: ["Visible knife marks within days", "Heat warping from hot cookware", "Staining from dyes and spices"],
    protection: "Self-healing film that absorbs daily abuse — knife marks vanish with gentle heat. Your Corian stays smooth.",
  },
];

/** Base dwell time in ms — high-risk surfaces get 2x. */
export const BASE_DWELL_MS = 4000;

/** Whether a surface qualifies for extended dwell time. */
export const isCriticalSurface = (p: SurfaceProfile): boolean =>
  p.riskLevel === "High";
