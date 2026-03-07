"use client";

import { useMemo } from "react";
import type { ScheduleEntry } from "@/utils/autoSelect";
import {
  diversityPick,
  diverseScorePick,
  computeRotationSchedule,
} from "@/utils/autoSelect";
import {
  type SurfaceProfile,
  profiles,
  BASE_DWELL_MS,
  isCriticalSurface,
} from "@/data/surfaces";

export type RotationMode = "auto" | "diverse";

/**
 * Builds a rotation schedule from the surface profiles based on the
 * selected mode. Isolates the diversity algorithm selection from UI
 * rendering so SurfaceFinder stays focused on interaction logic.
 *
 * - "auto": greedy interleaving by risk level (visual diversity)
 * - "diverse": multi-dimension set-cover scoring risk + material type
 */
export function useSchedule(mode: RotationMode): ScheduleEntry<SurfaceProfile>[] {
  return useMemo(() => {
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
}
