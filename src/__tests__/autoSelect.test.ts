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
});
