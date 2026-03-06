"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
}

/**
 * Drives a timer-based rotation through a pre-computed schedule.
 * Ticks every `tickMs` (default 100ms) for smooth progress bar updates.
 * Pauses automatically when the user interacts, resumes after `resumeDelay`.
 */
export function useRotationCycle<T>(
  schedule: ScheduleEntry<T>[],
  tickMs = 100,
  resumeDelay = 6000,
): RotationState<T> {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Tick the elapsed counter
  useEffect(() => {
    if (!playing || schedule.length === 0) return;
    const id = setInterval(() => setElapsed((e) => e + tickMs), tickMs);
    return () => clearInterval(id);
  }, [playing, tickMs, schedule.length]);

  const pause = useCallback(() => {
    setPlaying(false);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPlaying(true), resumeDelay);
  }, [resumeDelay]);

  const resume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPlaying(true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  return {
    active: activeEntryAt(schedule, elapsed),
    progress: calcProgress(schedule, elapsed),
    playing,
    pause,
    resume,
  };
}
