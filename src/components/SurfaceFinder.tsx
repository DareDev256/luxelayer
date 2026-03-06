"use client";

import { useState, useCallback, useMemo } from "react";
import Button from "./Button";
import Icon from "./Icon";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import {
  diversityPick,
  diverseScorePick,
  computeRotationSchedule,
} from "@/utils/autoSelect";
import { useRotationCycle } from "@/hooks/useRotationCycle";
import RotationIndicator from "./RotationIndicator";
import { profiles, BASE_DWELL_MS, isCriticalSurface } from "@/data/surfaces";

type RotationMode = "auto" | "diverse";

export default function SurfaceFinder() {
  const [selected, setSelected] = useState<number | null>(null);
  const [lastSelected, setLastSelected] = useState(0);
  const [mode, setMode] = useState<RotationMode>("auto");

  // Build schedule based on active mode
  const schedule = useMemo(() => {
    const order =
      mode === "diverse"
        ? diverseScorePick(
            profiles,
            [(p) => p.riskLevel, (p) => p.materialType],
            [25, 15],
          )
        : diversityPick(profiles, (p) => p.riskLevel);
    return computeRotationSchedule(profiles, order, BASE_DWELL_MS, isCriticalSurface);
  }, [mode]);

  const rotation = useRotationCycle(schedule);
  const autoProfile = rotation.active?.item ?? null;

  // Manual selection overrides auto-rotation
  const profile = selected !== null ? profiles[selected] : autoProfile;
  const display = profile ?? profiles[lastSelected];
  const hasProfile = !!(profile || autoProfile);

  // Derive the display index for pill highlighting
  const activeIndex = selected ?? (autoProfile ? profiles.indexOf(autoProfile) : null);

  const handleSelect = useCallback((i: number) => {
    setSelected((prev) => {
      if (prev === i) {
        // Deselecting — resume auto-rotation immediately
        rotation.resume();
        return null;
      }
      // Selecting — pause auto-rotation
      rotation.pause();
      setLastSelected(i);
      return i;
    });
  }, [rotation]);

  return (
    <Section id="surface-finder" variant="muted" maxWidth="4xl">
      <SectionHeader
        label="Find Your Fit"
        title="What Surface Do You Have?"
        description="Select your countertop material and see exactly what threatens it — and how we protect it."
      />

      {/* Rotation mode toggle */}
      <div className="flex justify-center mb-8" role="radiogroup" aria-label="Rotation mode">
        {(["auto", "diverse"] as const).map((m) => (
          <button
            key={m}
            role="radio"
            aria-checked={mode === m}
            onClick={() => { setMode(m); setSelected(null); rotation.reset(); }}
            className={`
              px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200
              first:rounded-l last:rounded-r border
              ${mode === m
                ? "bg-gold/15 border-gold/40 text-gold"
                : "bg-transparent border-white/8 text-warm-gray/35 hover:text-warm-gray/55 hover:border-white/15"
              }
            `}
          >
            {m === "auto" ? "Auto" : "Diverse"}
          </button>
        ))}
      </div>

      {/* Surface selector pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12" role="radiogroup" aria-label="Select your countertop surface type">
        {profiles.map((p, i) => {
          const isActive = activeIndex === i;
          const isAutoActive = selected === null && isActive;
          return (
            <button
              key={p.name}
              role="radio"
              aria-checked={isActive}
              onClick={() => handleSelect(i)}
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
                  style={{ width: `${rotation.progress * 100}%` }}
                  aria-hidden="true"
                />
              )}
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Rotation state indicator — visible only during auto-play */}
      {selected === null && (
        <RotationIndicator
          schedule={schedule}
          active={rotation.active}
          progress={rotation.progress}
          playing={rotation.playing}
          onToggle={rotation.playing ? rotation.pause : rotation.resume}
        />
      )}

      {/* Result panel — always mounted so CSS transitions play on both expand and collapse */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
        style={{
          gridTemplateRows: hasProfile ? "1fr" : "0fr",
          opacity: hasProfile ? 1 : 0,
        }}
        aria-live="polite"
        aria-hidden={!hasProfile}
      >
        <div className="overflow-hidden">
          <div className="border border-gold/15 rounded-lg p-8 bg-[#151515]">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gold">{display.name}</h3>
                <p className="text-warm-gray/40 text-sm mt-1">{display.tagline}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${display.riskColor}`}>
                <Icon name="alert" className="w-3.5 h-3.5" />
                {display.riskLevel} Risk
              </span>
            </div>

            {/* Two-column layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Threats */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-warm-gray/30 mb-3 font-semibold">Without Protection</h4>
                <ul className="space-y-2.5">
                  {display.threats.map((threat) => (
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
                <p className="text-sm text-warm-gray/70 leading-relaxed mb-5">{display.protection}</p>
                <Button
                  href="#contact"
                  size="md"
                  tabIndex={hasProfile ? 0 : -1}
                >
                  Get a Quote
                  <Icon name="bolt" className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state prompt — fades out when a profile is selected or auto-rotation is active */}
      <p
        className="text-center text-warm-gray/25 text-sm transition-opacity duration-300"
        style={{ opacity: hasProfile ? 0 : 1, height: hasProfile ? 0 : "auto", overflow: "hidden" }}
        aria-hidden={hasProfile}
      >
        Tap a surface above to see your personalized protection plan
      </p>
    </Section>
  );
}
