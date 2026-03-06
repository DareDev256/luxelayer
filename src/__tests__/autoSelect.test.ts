import { describe, it, expect } from "vitest";
import {
  diversityPick,
  diverseScorePick,
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

  it("avoids adjacent duplicates when mathematically possible (4-2-1 split)", () => {
    const items: Surface[] = [
      { name: "A", risk: "High" },
      { name: "B", risk: "High" },
      { name: "C", risk: "High" },
      { name: "D", risk: "High" },
      { name: "E", risk: "Medium" },
      { name: "F", risk: "Medium" },
      { name: "G", risk: "Moderate" },
    ];
    const order = diversityPick(items, (s) => s.risk);
    // 4 High ≤ ceil(7/2)=4, so zero adjacent duplicates are required
    for (let i = 1; i < order.length; i++) {
      expect(items[order[i]].risk).not.toBe(items[order[i - 1]].risk);
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

describe("diverseScorePick", () => {
  it("returns all indices for multi-dimension input", () => {
    const result = diverseScorePick(
      surfaces,
      [(s) => s.risk, (s) => (["Marble", "Granite", "Quartzite"].includes(s.name) ? "natural" : "engineered")],
    );
    expect(result).toHaveLength(surfaces.length);
    expect(new Set(result).size).toBe(surfaces.length);
  });

  it("prioritises unseen dimension values — first two picks cover different risks", () => {
    const order = diverseScorePick(surfaces, [(s) => s.risk]);
    expect(surfaces[order[0]].risk).not.toBe(surfaces[order[1]].risk);
  });

  it("returns empty for empty input", () => {
    expect(diverseScorePick([], [() => "x"])).toEqual([]);
  });

  it("custom bonuses shift priority — higher bonus dimension dominates", () => {
    interface Item { a: string; b: string }
    const items: Item[] = [
      { a: "X", b: "1" },
      { a: "X", b: "2" },
      { a: "Y", b: "1" },
    ];
    // Heavy bonus on dimension b — should prefer seeing "2" early
    const order = diverseScorePick(items, [(i) => i.a, (i) => i.b], [1, 100]);
    // First pick: index 0 (both unseen, lowest index wins)
    // Second pick: index 1 (b="2" unseen, +100) beats index 2 (a="Y" unseen, +1)
    expect(order[1]).toBe(1);
  });

  it("is deterministic across calls", () => {
    const dims = [(s: Surface) => s.risk];
    expect(diverseScorePick(surfaces, dims)).toEqual(diverseScorePick(surfaces, dims));
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

describe("diverseScorePick — edge cases", () => {
  it("single item returns [0]", () => {
    const items = [{ name: "A", risk: "High" }];
    expect(diverseScorePick(items, [(i) => i.risk])).toEqual([0]);
  });

  it("all-same degeneration — every item identical across all dimensions", () => {
    const items = Array.from({ length: 5 }, (_, i) => ({ id: i, cat: "X" }));
    const order = diverseScorePick(items, [(i) => i.cat]);
    // All scores are 0 after the first pick — tie-break by original index
    expect(order).toEqual([0, 1, 2, 3, 4]);
  });

  it("bonuses array shorter than dimensions pads missing entries with default 25", () => {
    const items = [
      { a: "X", b: "1" },
      { a: "Y", b: "2" },
    ];
    // bonuses[1] was undefined → previously caused NaN scores and infinite loop.
    // Now pads missing entries with default bonus (25).
    const order = diverseScorePick(items, [(i) => i.a, (i) => i.b], [10]);
    expect(order).toHaveLength(2);
    expect(new Set(order).size).toBe(2);
  });

  it("empty bonuses array falls back to all-default bonuses", () => {
    const items = [
      { a: "X", b: "1" },
      { a: "Y", b: "2" },
    ];
    const withEmpty = diverseScorePick(items, [(i) => i.a, (i) => i.b], []);
    const withDefault = diverseScorePick(items, [(i) => i.a, (i) => i.b]);
    expect(withEmpty).toEqual(withDefault);
  });

  it("three dimensions — covers all values greedily", () => {
    interface Item { x: string; y: string; z: string }
    const items: Item[] = [
      { x: "A", y: "1", z: "!" },
      { x: "B", y: "1", z: "!" },
      { x: "A", y: "2", z: "@" },
    ];
    const order = diverseScorePick(items, [(i) => i.x, (i) => i.y, (i) => i.z]);
    // First pick: idx 0 (3 unseen values). Second: idx 2 introduces y="2", z="@" (2 new)
    // vs idx 1 which introduces x="B" (1 new). So idx 2 should come second.
    expect(order[0]).toBe(0);
    expect(order[1]).toBe(2);
    expect(order[2]).toBe(1);
  });
});

describe("computeRotationSchedule — edge cases", () => {
  it("empty order produces empty schedule", () => {
    const schedule = computeRotationSchedule(surfaces, [], 4000, () => false);
    expect(schedule).toEqual([]);
  });

  it("zero baseDwell produces zero-dwell entries", () => {
    const order = [0, 1];
    const schedule = computeRotationSchedule(surfaces, order, 0, () => false);
    expect(schedule).toHaveLength(2);
    for (const e of schedule) expect(e.dwell).toBe(0);
    expect(cycleDuration(schedule)).toBe(0);
  });

  it("all-critical schedule doubles every entry", () => {
    const order = [0, 1, 2];
    const schedule = computeRotationSchedule(surfaces, order, 1000, () => true);
    for (const e of schedule) {
      expect(e.critical).toBe(true);
      expect(e.dwell).toBe(2000);
    }
    expect(cycleDuration(schedule)).toBe(6000);
  });

  it("no-critical schedule keeps base dwell for all", () => {
    const order = [0, 1, 2];
    const schedule = computeRotationSchedule(surfaces, order, 1000, () => false);
    for (const e of schedule) {
      expect(e.critical).toBe(false);
      expect(e.dwell).toBe(1000);
    }
  });

  it("single-entry schedule has offset 0", () => {
    const schedule = computeRotationSchedule(surfaces, [3], 5000, () => false);
    expect(schedule).toHaveLength(1);
    expect(schedule[0].offset).toBe(0);
    expect(schedule[0].item).toBe(surfaces[3]);
  });
});

describe("cycleProgress — boundary & negative", () => {
  it("negative elapsed wraps and produces valid 0-1 progress", () => {
    const schedule = buildSchedule(4000);
    const p = cycleProgress(schedule, -500);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(1);
  });

  it("progress resets to 0 at exact entry boundary transition", () => {
    const schedule = buildSchedule(4000);
    // At the exact start of entry[1], progress within that entry should be 0
    const p = cycleProgress(schedule, schedule[1].offset);
    expect(p).toBeCloseTo(0, 5);
  });

  it("zero-dwell schedule returns 0 progress", () => {
    const schedule = computeRotationSchedule(surfaces, [0], 0, () => false);
    expect(cycleProgress(schedule, 1000)).toBe(0);
  });
});

describe("activeEntryAt — single-entry & stress", () => {
  it("single-entry schedule always returns that entry", () => {
    const schedule = computeRotationSchedule(surfaces, [0], 3000, () => false);
    expect(activeEntryAt(schedule, 0)).toBe(schedule[0]);
    expect(activeEntryAt(schedule, 1500)).toBe(schedule[0]);
    expect(activeEntryAt(schedule, 2999)).toBe(schedule[0]);
    expect(activeEntryAt(schedule, 3000)).toBe(schedule[0]); // wraps
  });

  it("mid-entry lookup resolves to correct entry", () => {
    const schedule = buildSchedule(4000);
    // Entry[1] spans [offset, offset+dwell). Midpoint must resolve to entry[1].
    const mid = schedule[1].offset + schedule[1].dwell / 2;
    expect(activeEntryAt(schedule, mid)).toBe(schedule[1]);
  });
});

describe("diverseScorePick pipeline integration", () => {
  it("diverseScorePick -> schedule -> every entry reachable", () => {
    const order = diverseScorePick(surfaces, [
      (s) => s.risk,
      (s) => s.name.charAt(0),
    ]);
    const schedule = computeRotationSchedule(surfaces, order, 3000, (s) => s.risk === "High");
    for (const entry of schedule) {
      expect(activeEntryAt(schedule, entry.offset)!.item).toBe(entry.item);
    }
  });

  it("weighted dimensions shift pick order when categories overlap", () => {
    interface Item { cat: string; tag: string }
    const items: Item[] = [
      { cat: "A", tag: "X" },  // 0
      { cat: "A", tag: "Y" },  // 1
      { cat: "B", tag: "X" },  // 2
    ];
    // Equal weights: first=0 (tie→lowest idx), second=2 (cat=B unseen +25, tag=X seen 0) vs 1 (cat=A seen 0, tag=Y unseen +25) → tie→lower idx=1
    const equal = diverseScorePick(items, [(i) => i.cat, (i) => i.tag], [25, 25]);
    // Heavy cat weight: second pick: idx 2 scores cat=B unseen +100 vs idx 1 scores tag=Y unseen +1 → idx 2 wins
    const catHeavy = diverseScorePick(items, [(i) => i.cat, (i) => i.tag], [100, 1]);
    expect(equal[1]).toBe(1);    // tie-break picks lower index
    expect(catHeavy[1]).toBe(2); // cat bonus dominates
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
