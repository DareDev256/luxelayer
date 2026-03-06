"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
  /** Viewport threshold (0-1) before triggering. Default: 0.15 */
  threshold?: number;
  /** Once revealed, stays visible (no re-hide on scroll up). Default: true */
  once?: boolean;
  /** Root margin to trigger earlier/later. Default: "0px 0px -40px 0px" */
  rootMargin?: string;
}

/**
 * Intersection Observer hook that tracks when an element enters the viewport.
 * Returns a ref to attach and a boolean `isVisible` state.
 *
 * Why IO over scroll listeners: IO runs off the main thread — no jank,
 * no throttle hacks, no layout thrashing from getBoundingClientRect().
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, once = true, rootMargin = "0px 0px -40px 0px" } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, isVisible };
}
