"use client";

import type { SurfaceProfile } from "@/data/surfaces";

interface SurfacePillsProps {
  profiles: SurfaceProfile[];
  activeIndex: number | null;
  /** Non-null when the user manually pinned a pill */
  selected: number | null;
  /** 0-1 dwell progress — drives the inline progress bar */
  progress: number;
  onSelect: (index: number) => void;
}

/**
 * Horizontally-wrapped pill selector for surface profiles.
 *
 * Each pill shows the surface name. The auto-active pill (no manual
 * selection) renders a thin gold progress bar along its bottom edge
 * that advances with the rotation timer — giving users a visual read
 * on when the next surface will appear without any extra chrome.
 */
export default function SurfacePills({
  profiles,
  activeIndex,
  selected,
  progress,
  onSelect,
}: SurfacePillsProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-3 mb-12"
      role="radiogroup"
      aria-label="Select your countertop surface type"
    >
      {profiles.map((p, i) => {
        const isActive = activeIndex === i;
        const isAutoActive = selected === null && isActive;
        return (
          <button
            key={p.name}
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(i)}
            className={`
              relative px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-300 overflow-hidden
              ${isActive
                ? "border-gold bg-gold/10 text-gold shadow-[0_0_12px_rgba(201,168,76,0.2)]"
                : "border-white/10 text-warm-gray/50 hover:border-white/25 hover:text-warm-gray/80"
              }
            `}
          >
            {/* Auto-rotation progress bar — only visible during auto-play */}
            {isAutoActive && (
              <span
                className="absolute bottom-0 left-0 h-0.5 bg-gold/40 transition-[width] duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
                aria-hidden="true"
              />
            )}
            {p.name}
          </button>
        );
      })}
    </div>
  );
}
