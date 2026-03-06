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
 * Reorders items for maximum visual diversity — alternates by a
 * keyed severity so adjacent entries never share the same category.
 * Returns indices into the original array.
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

  // Round-robin from each bucket, largest first
  const sorted = [...buckets.values()].sort((a, b) => b.length - a.length);
  const result: number[] = [];
  let col = 0;
  while (result.length < items.length) {
    for (const bucket of sorted) {
      if (col < bucket.length) result.push(bucket[col]);
    }
    col++;
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
 * Uses double-modulo to handle negative values gracefully.
 */
export function activeEntryAt<T>(
  schedule: ScheduleEntry<T>[],
  elapsed: number,
): ScheduleEntry<T> | null {
  if (schedule.length === 0) return null;
  const total = cycleDuration(schedule);
  if (total === 0) return null;

  // Double-modulo wraps negatives into [0, total)
  const t = ((elapsed % total) + total) % total;

  for (let i = schedule.length - 1; i >= 0; i--) {
    if (t >= schedule[i].offset) return schedule[i];
  }
  return schedule[0];
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
  const t = ((elapsed % total) + total) % total;
  return Math.min(1, (t - entry.offset) / entry.dwell);
}
