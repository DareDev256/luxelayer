import { describe, it, expect } from "vitest";
import {
  diversityPick,
  computeRotationSchedule,
  cycleDuration,
  cycleIndex,
  activeEntryAt,
  cycleProgress,
} from "@/utils/autoSelect";

interface Surface {
  name: string;
  risk: string;
}

const surfaces: Surface[] = [
  { name: "Marble", risk: "High" },
  { name: "Quartz", risk: "Medium" },
  { name: "Granite", risk: "High" },
  { name: "Quartzite", risk: "Moderate" },
  { name: "Porcelain", risk: "Medium" },
  { name: "Solid Surface", risk: "High" },
];

function buildSchedule(base = 4000) {
  const order = diversityPick(surfaces, (s) => s.risk);
  return computeRotationSchedule(surfaces, order, base, (s) => s.risk === "High");
}

describe("diversityPick", () => {
  it("returns indices for all items", () => {
    const result = diversityPick(surfaces, (s) => s.risk);
    expect(result).toHaveLength(surfaces.length);
    expect(new Set(result).size).toBe(surfaces.length);
  });

  it("alternates severity categories — no two adjacent items share a risk", () => {
    const order = diversityPick(surfaces, (s) => s.risk);
    for (let i = 1; i < order.length; i++) {
      const prev = surfaces[order[i - 1]].risk;
      const curr = surfaces[order[i]].risk;
      // Adjacent entries should differ (when possible)
      if (new Set(surfaces.map((s) => s.risk)).size > 1) {
        expect(curr).not.toBe(prev);
      }
    }
  });

  it("returns empty array for empty input", () => {
    expect(diversityPick([], () => "x")).toEqual([]);
  });

  it("handles single item without crashing", () => {
    const single: Surface[] = [{ name: "Marble", risk: "High" }];
    const order = diversityPick(single, (s) => s.risk);
    expect(order).toEqual([0]);
  });

  it("single-category degeneration — all same risk still returns valid permutation", () => {
    const allHigh: Surface[] = [
      { name: "Marble", risk: "High" },
      { name: "Granite", risk: "High" },
      { name: "Solid Surface", risk: "High" },
    ];
    const order = diversityPick(allHigh, (s) => s.risk);
    expect(order).toHaveLength(3);
    expect(new Set(order).size).toBe(3);
    // All indices must be valid
    for (const idx of order) {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(allHigh.length);
    }
  });

  it("uneven buckets — largest bucket forces adjacent duplicates gracefully", () => {
    const skewed: Surface[] = [
      { name: "A", risk: "High" },
      { name: "B", risk: "High" },
      { name: "C", risk: "High" },
      { name: "D", risk: "High" },
      { name: "E", risk: "High" },
      { name: "F", risk: "Low" },
    ];
    const order = diversityPick(skewed, (s) => s.risk);
    expect(order).toHaveLength(6);
    expect(new Set(order).size).toBe(6);
    // First two should differ (High then Low interleaved at start)
    expect(skewed[order[0]].risk).not.toBe(skewed[order[1]].risk);
  });

  it("two equal-size categories produce perfect alternation", () => {
    const balanced: Surface[] = [
      { name: "A", risk: "High" },
      { name: "B", risk: "High" },
      { name: "C", risk: "Low" },
      { name: "D", risk: "Low" },
    ];
    const order = diversityPick(balanced, (s) => s.risk);
    for (let i = 1; i < order.length; i++) {
      expect(balanced[order[i]].risk).not.toBe(balanced[order[i - 1]].risk);
    }
  });

  it("is deterministic — same input always yields same output", () => {
    const a = diversityPick(surfaces, (s) => s.risk);
    const b = diversityPick(surfaces, (s) => s.risk);
    expect(a).toEqual(b);
  });

  it("many unique categories — each item in its own bucket", () => {
    const unique: Surface[] = [
      { name: "A", risk: "1" },
      { name: "B", risk: "2" },
      { name: "C", risk: "3" },
      { name: "D", risk: "4" },
    ];
    const order = diversityPick(unique, (s) => s.risk);
    expect(order).toHaveLength(4);
    expect(new Set(order).size).toBe(4);
  });
});

describe("computeRotationSchedule", () => {
  it("assigns 2x dwell to critical entries", () => {
    const schedule = buildSchedule(4000);
    for (const entry of schedule) {
      if (entry.critical) {
        expect(entry.dwell).toBe(8000);
      } else {
        expect(entry.dwell).toBe(4000);
      }
    }
  });

  it("cumulative offsets are monotonically increasing", () => {
    const schedule = buildSchedule();
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].offset).toBeGreaterThan(schedule[i - 1].offset);
    }
  });

  it("total duration equals sum of all dwells", () => {
    const schedule = buildSchedule(4000);
    const total = cycleDuration(schedule);
    const sum = schedule.reduce((acc, e) => acc + e.dwell, 0);
    expect(total).toBe(sum);
  });
});

describe("activeEntryAt", () => {
  it("returns first entry at elapsed=0", () => {
    const schedule = buildSchedule();
    const entry = activeEntryAt(schedule, 0);
    expect(entry).toBe(schedule[0]);
  });

  it("returns null for empty schedule", () => {
    expect(activeEntryAt([], 5000)).toBeNull();
  });

  it("wraps around at cycle boundary", () => {
    const schedule = buildSchedule();
    const total = cycleDuration(schedule);
    // Just past the end should wrap to first entry
    expect(activeEntryAt(schedule, total + 1)).toBe(
      activeEntryAt(schedule, 1),
    );
  });

  it("handles negative elapsed via double-modulo", () => {
    const schedule = buildSchedule(4000);
    const total = cycleDuration(schedule);
    // -1ms should map to total-1ms
    const fromNeg = activeEntryAt(schedule, -1);
    const fromPos = activeEntryAt(schedule, total - 1);
    expect(fromNeg).toBe(fromPos);
  });

  it("exact boundary — last ms of entry[0] stays on entry[0]", () => {
    const schedule = buildSchedule(4000);
    const boundary = schedule[0].dwell - 1; // last ms before transition
    expect(activeEntryAt(schedule, boundary)).toBe(schedule[0]);
  });

  it("exact boundary — first ms of entry[1] lands on entry[1]", () => {
    const schedule = buildSchedule(4000);
    const boundary = schedule[1].offset; // exact start of entry 1
    expect(activeEntryAt(schedule, boundary)).toBe(schedule[1]);
  });

  it("walks every entry boundary without skipping any entry", () => {
    const schedule = buildSchedule(4000);
    const visited = new Set<number>();
    for (const entry of schedule) {
      const found = activeEntryAt(schedule, entry.offset);
      expect(found).toBe(entry);
      visited.add(entry.offset);
    }
    expect(visited.size).toBe(schedule.length);
  });

  it("large negative elapsed wraps correctly", () => {
    const schedule = buildSchedule(4000);
    const total = cycleDuration(schedule);
    // -10 full cycles should still resolve correctly
    const entry = activeEntryAt(schedule, -10 * total + 5);
    expect(entry).toBe(activeEntryAt(schedule, 5));
  });
});

describe("cycleProgress", () => {
  it("returns 0 at the start of an entry's dwell", () => {
    const schedule = buildSchedule();
    expect(cycleProgress(schedule, 0)).toBe(0);
  });

  it("returns ~0.5 at midpoint of first entry", () => {
    const schedule = buildSchedule(4000);
    const mid = schedule[0].dwell / 2;
    const progress = cycleProgress(schedule, mid);
    expect(progress).toBeCloseTo(0.5, 1);
  });

  it("returns 0 for empty schedule", () => {
    expect(cycleProgress([], 1000)).toBe(0);
  });

  it("never exceeds 1", () => {
    const schedule = buildSchedule();
    // Test at various points including boundary
    for (let t = 0; t < cycleDuration(schedule) * 3; t += 500) {
      expect(cycleProgress(schedule, t)).toBeLessThanOrEqual(1);
    }
  });
});

describe("cycleIndex", () => {
  it("returns 0 on first cycle", () => {
    const schedule = buildSchedule();
    expect(cycleIndex(schedule, 0)).toBe(0);
  });

  it("returns 1 after one full cycle", () => {
    const schedule = buildSchedule();
    const total = cycleDuration(schedule);
    expect(cycleIndex(schedule, total)).toBe(1);
  });

  it("returns 0 for empty schedule", () => {
    expect(cycleIndex([], 5000)).toBe(0);
  });

  it("negative elapsed produces negative cycle index", () => {
    const schedule = buildSchedule(4000);
    const total = cycleDuration(schedule);
    expect(cycleIndex(schedule, -total)).toBe(-1);
  });
});

describe("pipeline integration", () => {
  it("full pipeline: diversityPick -> schedule -> every entry reachable via activeEntryAt", () => {
    const order = diversityPick(surfaces, (s) => s.risk);
    const schedule = computeRotationSchedule(surfaces, order, 3000, (s) => s.risk === "High");
    const total = cycleDuration(schedule);
    expect(total).toBeGreaterThan(0);

    // Every scheduled entry must be reachable at its offset
    for (const entry of schedule) {
      const found = activeEntryAt(schedule, entry.offset);
      expect(found!.item).toBe(entry.item);
    }
  });

  it("schedule entry count matches diversityPick output length", () => {
    const order = diversityPick(surfaces, (s) => s.risk);
    const schedule = computeRotationSchedule(surfaces, order, 4000, (s) => s.risk === "High");
    expect(schedule).toHaveLength(order.length);
  });

  it("schedule preserves diversity ordering from diversityPick", () => {
    const order = diversityPick(surfaces, (s) => s.risk);
    const schedule = computeRotationSchedule(surfaces, order, 4000, (s) => s.risk === "High");
    for (let i = 0; i < order.length; i++) {
      expect(schedule[i].item).toBe(surfaces[order[i]]);
    }
  });

  it("cycleProgress at exact end of last entry is clamped to 1", () => {
    const schedule = buildSchedule(4000);
    const total = cycleDuration(schedule);
    // 1ms before cycle wraps: should be at or near 1 for last entry
    const progress = cycleProgress(schedule, total - 1);
    expect(progress).toBeGreaterThan(0.9);
    expect(progress).toBeLessThanOrEqual(1);
  });
});
