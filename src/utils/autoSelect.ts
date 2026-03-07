/**
 * Auto-select rotation engine — pure functions that drive timer-based
 * UI cycling through SurfaceFinder profiles.
 *
 * Pipeline: diversityPick → computeRotationSchedule → activeEntryAt
 * Helper:   cycleProgress (0-1 dwell fraction), cycleIndex (which lap)
 */

export interface ScheduleEntry<T = unknown> {
  item: T;
  dwell: number;       // ms this entry stays active
  offset: number;      // cumulative ms from cycle start
  critical: boolean;   // gets 2× dwell time
}

/**
 * Greedy set-cover pick — maximises diversity across multiple dimensions.
 * Each round scores every remaining candidate by how many *unseen* values
 * it would introduce (marginal diversity bonus). Ties fall back to original
 * order so quality ranking is preserved.
 *
 * @param dimensions  Array of key-extractors (e.g. risk, material type)
 * @param bonuses     Per-dimension bonus for an unseen value (default 25 each)
 */
export function diverseScorePick<T>(
  items: T[],
  dimensions: Array<(item: T) => string>,
  bonuses?: number[],
): number[] {
  if (items.length === 0) return [];

  // Pad/clamp bonuses to match dimensions — prevents NaN scores when
  // callers pass a shorter array (previously caused an infinite loop).
  const raw = bonuses ?? [];
  const bons = dimensions.map((_, d) => raw[d] ?? 25);
  const seen: Set<string>[] = dimensions.map(() => new Set());
  const remaining = new Set(items.map((_, i) => i));
  const result: number[] = [];

  while (remaining.size > 0) {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (const idx of remaining) {
      let score = 0;
      for (let d = 0; d < dimensions.length; d++) {
        const val = dimensions[d](items[idx]);
        if (!seen[d].has(val)) score += bons[d];
      }
      // Tie-break: prefer lower original index (preserves quality order)
      if (score > bestScore || (score === bestScore && (bestIdx === -1 || idx < bestIdx))) {
        bestScore = score;
        bestIdx = idx;
      }
    }

    result.push(bestIdx);
    remaining.delete(bestIdx);
    for (let d = 0; d < dimensions.length; d++) {
      seen[d].add(dimensions[d](items[bestIdx]));
    }
  }

  return result;
}

/**
 * Reorders items for maximum visual diversity — greedy interleaving
 * that maximises separation between same-category entries.
 *
 * Algorithm: each round picks from the largest remaining bucket whose
 * category differs from the previous pick. Falls back to same-category
 * only when every other bucket is exhausted (mathematically unavoidable).
 *
 * Adjacent duplicates are impossible when the largest bucket size
 * is ≤ ceil(items.length / 2). When it exceeds that, duplicates are
 * pushed to the tail rather than scattered unpredictably.
 *
 * @returns Indices into the original array, reordered for diversity.
 */
export function diversityPick<T>(
  items: T[],
  severityKey: (item: T) => string,
): number[] {
  if (items.length === 0) return [];

  const buckets = new Map<string, number[]>();
  for (let i = 0; i < items.length; i++) {
    const key = severityKey(items[i]);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(i);
  }

  // Track consumption position within each bucket
  const pos = new Map<string, number>();
  for (const key of buckets.keys()) pos.set(key, 0);

  const remaining = (key: string) =>
    buckets.get(key)!.length - pos.get(key)!;

  const result: number[] = [];
  let lastKey: string | null = null;

  while (result.length < items.length) {
    let bestKey: string | null = null;
    let bestRem = -1;

    // Prefer the largest bucket that differs from the last pick
    for (const [key] of buckets) {
      const rem = remaining(key);
      if (rem <= 0 || key === lastKey) continue;
      if (rem > bestRem) { bestKey = key; bestRem = rem; }
    }

    // Fallback: all remaining items share the last category
    if (bestKey === null) {
      for (const [key] of buckets) {
        const rem = remaining(key);
        if (rem > 0 && rem > bestRem) { bestKey = key; bestRem = rem; }
      }
    }

    if (bestKey === null) break; // safety — shouldn't happen

    const p = pos.get(bestKey)!;
    result.push(buckets.get(bestKey)![p]);
    pos.set(bestKey, p + 1);
    lastKey = bestKey;
  }

  return result;
}

/**
 * Builds a rotation schedule with cumulative offsets.
 * Critical entries (isCritical returns true) get 2× baseDwell.
 */
export function computeRotationSchedule<T>(
  items: T[],
  order: number[],
  baseDwell: number,
  isCritical: (item: T) => boolean,
): ScheduleEntry<T>[] {
  let offset = 0;
  return order.map((idx) => {
    const item = items[idx];
    const critical = isCritical(item);
    const dwell = critical ? baseDwell * 2 : baseDwell;
    const entry: ScheduleEntry<T> = { item, dwell, offset, critical };
    offset += dwell;
    return entry;
  });
}

/** Total duration of one full rotation cycle. */
export function cycleDuration<T>(schedule: ScheduleEntry<T>[]): number {
  if (schedule.length === 0) return 0;
  const last = schedule[schedule.length - 1];
  return last.offset + last.dwell;
}

/**
 * Wraps an elapsed time into [0, total) using double-modulo.
 * Handles negative values gracefully — e.g. -1 maps to total-1.
 * Returns 0 when total is 0 (prevents NaN from 0%0).
 */
export function wrapElapsed(elapsed: number, total: number): number {
  if (total === 0) return 0;
  return ((elapsed % total) + total) % total;
}

/**
 * Which cycle (0-based lap) we're on at a given elapsed time.
 * Handles negative elapsed via double-modulo wrapping.
 */
export function cycleIndex<T>(
  schedule: ScheduleEntry<T>[],
  elapsed: number,
): number {
  const total = cycleDuration(schedule);
  if (total === 0) return 0;
  return Math.floor(elapsed / total);
}

/**
 * Returns the schedule entry active at a given elapsed time.
 * Uses binary search over sorted offsets — O(log n) instead of
 * the previous reverse linear scan. Offsets are monotonically
 * increasing by construction (computeRotationSchedule), so binary
 * search is the correct algorithm for this sorted data.
 */
export function activeEntryAt<T>(
  schedule: ScheduleEntry<T>[],
  elapsed: number,
): ScheduleEntry<T> | null {
  if (schedule.length === 0) return null;
  const total = cycleDuration(schedule);
  if (total === 0) return null;

  const t = wrapElapsed(elapsed, total);

  // Binary search: find the rightmost entry whose offset <= t
  let lo = 0;
  let hi = schedule.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1; // ceil to avoid infinite loop on lo=mid
    if (schedule[mid].offset <= t) lo = mid;
    else hi = mid - 1;
  }
  return schedule[lo];
}

/**
 * Progress (0-1) through the current entry's dwell period.
 * Returns 0 for empty schedules.
 */
export function cycleProgress<T>(
  schedule: ScheduleEntry<T>[],
  elapsed: number,
): number {
  const entry = activeEntryAt(schedule, elapsed);
  if (!entry || entry.dwell === 0) return 0;

  const total = cycleDuration(schedule);
  const t = wrapElapsed(elapsed, total);
  return Math.min(1, (t - entry.offset) / entry.dwell);
}
