"use client";

import type { SurfaceScheduleEntry } from "@/data/surfaces";

interface RotationIndicatorProps {
  schedule: SurfaceScheduleEntry[];
  active: SurfaceScheduleEntry | null;
  progress: number;
  playing: boolean;
  onToggle: () => void;
}

const RISK_DOT: Record<string, string> = {
  High: "bg-red-400",
  Medium: "bg-amber-400",
  Moderate: "bg-yellow-500",
};

const RING_SIZE = 40;
const STROKE = 3;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Compact rotation status indicator — shows an SVG progress ring,
 * the active surface name, and a queue of risk-colored dots.
 * Click anywhere to pause/resume rotation.
 *
 * Designed to sit inline within SurfaceFinder, giving users a legible
 * read on the auto-rotation state without cluttering the pill bar.
 */
export default function RotationIndicator({
  schedule,
  active,
  progress,
  playing,
  onToggle,
}: RotationIndicatorProps) {
  if (!active || schedule.length === 0) return null;

  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const activeIdx = schedule.indexOf(active);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause auto-rotation" : "Resume auto-rotation"}
      className="group flex items-center gap-3 mx-auto mb-6 px-4 py-2 rounded-full
        border border-white/6 bg-white/[0.02] hover:border-gold/20
        transition-all duration-300 cursor-pointer select-none"
    >
      {/* Progress ring */}
      <div className="relative flex-shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className="rotate-[-90deg]"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-100 ease-linear"
            style={{ opacity: playing ? 1 : 0.3 }}
          />
        </svg>
        {/* Pause/play icon center */}
        <span className="absolute inset-0 flex items-center justify-center text-gold/60 group-hover:text-gold transition-colors duration-200">
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="2" y="1" width="3" height="10" rx="0.5" />
              <rect x="7" y="1" width="3" height="10" rx="0.5" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M3 1.5v9l7-4.5-7-4.5z" />
            </svg>
          )}
        </span>
      </div>

      {/* Active surface label */}
      <span className="text-sm font-medium text-warm-gray/50 group-hover:text-warm-gray/70 transition-colors duration-200 min-w-[80px] text-left">
        {active.item.name}
      </span>

      {/* Queue dots — risk-colored, active one pulses */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {schedule.map((entry, i) => (
          <span
            key={entry.item.name}
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-300
              ${RISK_DOT[entry.item.riskLevel] ?? "bg-warm-gray/20"}
              ${i === activeIdx ? "scale-[1.8] opacity-100" : "opacity-30"}
            `}
          />
        ))}
      </div>
    </button>
  );
}
