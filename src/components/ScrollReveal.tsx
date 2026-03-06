"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { ReactNode, CSSProperties } from "react";

type RevealDirection = "up" | "left" | "right" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation direction. Default: "up" */
  direction?: RevealDirection;
  /** Stagger delay in ms for sequenced reveals. Default: 0 */
  delay?: number;
  /** Animation duration in ms. Default: 700 */
  duration?: number;
  /** Additional className */
  className?: string;
}

const transforms: Record<RevealDirection, string> = {
  up: "translateY(32px)",
  left: "translateX(-32px)",
  right: "translateX(32px)",
  fade: "none",
};

/**
 * Wrapper component that reveals children on scroll with directional motion.
 * Uses `will-change: transform, opacity` only during the animation phase
 * then removes it — avoids compositor layer bloat on long pages.
 */
export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className = "",
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.12 });

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "none" : transforms[direction],
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: isVisible ? "auto" : "transform, opacity",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
