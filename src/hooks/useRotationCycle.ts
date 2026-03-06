"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  type ScheduleEntry,
  activeEntryAt,
  cycleProgress as calcProgress,
} from "@/utils/autoSelect";

interface RotationState<T> {
  /** Currently active entry (null if schedule is empty) */
  active: ScheduleEntry<T> | null;
  /** 0-1 progress through the current entry's dwell */
  progress: number;
  /** Whether the rotation timer is running */
  playing: boolean;
  /** Pause the rotation (e.g. on user interaction) */
  pause: () => void;
  /** Resume after pause */
  resume: () => void;
  /** Reset elapsed to 0 and resume — call on schedule identity change */
  reset: () => void;
}

/**
 * Drives a timer-based rotation through a pre-computed schedule.
 * Ticks every `tickMs` (default 100ms) for smooth progress bar updates.
 * Pauses automatically when the user interacts, resumes after `resumeDelay`.
 *
 * Auto-resets when the schedule content changes (tracked via a derived
 * identity key), so callers don't need to manually call `reset()` on
 * mode switches.
 */
export function useRotationCycle<T>(
  schedule: ScheduleEntry<T>[],
  tickMs = 100,
  resumeDelay = 6000,
): RotationState<T> {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  // Stable identity key — detects when schedule *content* changes,
  // not just length. Prevents stale offsets when switching rotation modes
  // that produce same-length but differently-ordered schedules.
  const scheduleKey = useMemo(
    () => schedule.map((e) => `${e.offset}:${e.dwell}`).join("|"),
    [schedule],
  );

  // Track schedule identity in state — when the schedule content changes,
  // reset elapsed and resume. This is React's sanctioned "store previous
  // value" pattern: setState during render triggers an immediate re-render
  // with the new values before the component commits to the DOM.
  const [prevKey, setPrevKey] = useState(scheduleKey);
  if (prevKey !== scheduleKey) {
    setPrevKey(scheduleKey);
    setElapsed(0);
    setPlaying(true);
  }

  // Clear any pending auto-resume timer when schedule identity changes
  useEffect(() => clearResumeTimer, [prevKey, clearResumeTimer]);

  // Tick the elapsed counter — cleanup clears both interval and pending resume
  useEffect(() => {
    if (!playing || schedule.length === 0) return;
    const id = setInterval(() => setElapsed((e) => e + tickMs), tickMs);
    return () => {
      clearInterval(id);
      clearResumeTimer();
    };
  }, [playing, tickMs, schedule.length, clearResumeTimer]);

  const pause = useCallback(() => {
    setPlaying(false);
    clearResumeTimer();
    resumeTimer.current = setTimeout(() => setPlaying(true), resumeDelay);
  }, [resumeDelay, clearResumeTimer]);

  const resume = useCallback(() => {
    clearResumeTimer();
    setPlaying(true);
  }, [clearResumeTimer]);

  /** Reset elapsed to 0 — call when the schedule identity changes. */
  const reset = useCallback(() => {
    setElapsed(0);
    clearResumeTimer();
    setPlaying(true);
  }, [clearResumeTimer]);

  return {
    active: activeEntryAt(schedule, elapsed),
    progress: calcProgress(schedule, elapsed),
    playing,
    pause,
    resume,
    reset,
  };
}
