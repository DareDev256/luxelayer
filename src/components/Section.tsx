import type { ReactNode } from "react";

const maxWidthMap = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

interface SectionProps {
  children: ReactNode;
  /** Section id for anchor navigation and IO tracking */
  id?: string;
  /** Background variant — "muted" applies the charcoal background */
  variant?: "default" | "muted";
  /** Container max-width. Default: "6xl" */
  maxWidth?: keyof typeof maxWidthMap;
  /** Additional className on the outer section element */
  className?: string;
}

/**
 * Layout wrapper that enforces consistent section structure:
 * vertical rhythm (py-24), horizontal padding (px-6), centered
 * max-width container, and background alternation.
 *
 * Centralises layout policy so padding/spacing changes propagate
 * from a single file instead of touching every section component.
 */
export default function Section({
  children,
  id,
  variant = "default",
  maxWidth = "6xl",
  className = "",
}: SectionProps) {
  const bg = variant === "muted" ? "bg-charcoal" : "";

  return (
    <section id={id} className={`py-24 px-6 ${bg} ${className}`.trim()}>
      <div className={`${maxWidthMap[maxWidth]} mx-auto`}>{children}</div>
    </section>
  );
}
