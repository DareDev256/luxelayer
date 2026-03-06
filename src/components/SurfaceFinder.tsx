"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import SurfacePills from "./SurfacePills";
import SurfaceDetail from "./SurfaceDetail";
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

  const { active, progress, playing, pause, resume } = useRotationCycle(schedule);

  // Stable toggle — `playing` changes far less often than tick renders.
  // `pause` and `resume` are already referentially stable (useCallback in hook).
  const toggleRotation = useCallback(() => {
    if (playing) pause();
    else resume();
  }, [playing, pause, resume]);
  const autoProfile = active?.item ?? null;

  // Manual selection overrides auto-rotation
  const profile = selected !== null ? profiles[selected] : autoProfile;
  const display = profile ?? profiles[lastSelected];
  const hasProfile = !!(profile || autoProfile);

  // Derive the display index for pill highlighting
  const activeIndex = selected ?? (autoProfile ? profiles.indexOf(autoProfile) : null);

  const handleSelect = useCallback((i: number) => {
    setSelected((prev) => (prev === i ? null : i));
    setLastSelected(i);
  }, []);

  // Side effects live outside the state updater — fires after selection state settles
  useEffect(() => {
    if (selected === null) resume();        // deselected → resume auto-rotation
    else pause();                           // pinned → pause
  }, [selected, pause, resume]);

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
            onClick={() => { setMode(m); setSelected(null); }}
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
      <SurfacePills
        profiles={profiles}
        activeIndex={activeIndex}
        selected={selected}
        progress={progress}
        onSelect={handleSelect}
      />

      {/* Rotation state indicator — visible only during auto-play */}
      {selected === null && (
        <RotationIndicator
          schedule={schedule}
          active={active}
          progress={progress}
          playing={playing}
          onToggle={toggleRotation}
        />
      )}

      {/* Result panel — always mounted so CSS transitions play on both expand and collapse */}
      <SurfaceDetail profile={display} visible={hasProfile} />

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
