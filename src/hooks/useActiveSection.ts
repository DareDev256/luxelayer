"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Tracks which section is currently most visible in the viewport.
 * Uses Intersection Observer with a rootMargin that biases toward
 * the top third of the screen — matches where the eye naturally rests
 * when scrolling a landing page.
 *
 * Returns the `id` attribute of the most-visible observed section.
 *
 * Race-condition guard: the `ratios` Map is cleared on every effect
 * cleanup so stale entries from a previous observer never bleed into
 * the next. The comparison loop is also scoped to `trackedIds` rather
 * than the full Map — fast-scroll scenarios where IO batches miss
 * intermediate thresholds can leave orphaned entries that would
 * otherwise win the "best ratio" comparison.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    // Snapshot the tracked set so the callback closure only considers
    // IDs from this effect cycle — prevents stale-entry races.
    const trackedIds = new Set(sectionIds);

    // Clear any leftover ratios from the previous observer cycle.
    ratios.current.clear();

    // Observe with multiple thresholds for granular ratio tracking.
    // rootMargin: shrink the effective viewport to the top 40% of the screen
    // so the "active" section flips earlier — feels more natural when scrolling down.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.intersectionRatio);
        }

        // Pick the section with the highest intersection ratio —
        // only consider IDs from the current tracked set.
        let best: string | null = null;
        let bestRatio = 0;
        for (const id of trackedIds) {
          const ratio = ratios.current.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }

        if (best && bestRatio > 0) {
          setActive(best);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-10% 0px -50% 0px",
      }
    );

    for (const el of elements) observer.observe(el);

    const ratioMap = ratios.current;
    return () => {
      observer.disconnect();
      ratioMap.clear();
    };
  }, [sectionIds]);

  return active;
}
