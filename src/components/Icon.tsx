/**
 * Shared icon library — single source of truth for all SVG icons used
 * across the landing page. Eliminates duplicated SVG paths and ensures
 * consistent sizing, stroke widths, and accessibility attributes.
 *
 * All icons default to 24×24 with currentColor so they inherit the
 * parent's text color via Tailwind classes.
 */

export type IconName =
  | "star"
  | "shield"
  | "bolt"
  | "check"
  | "alert"
  | "beaker"
  | "dollar"
  | "chevron-down"
  | "image";

interface IconProps {
  name: IconName;
  /** Tailwind size class, e.g. "w-4 h-4". Default: "w-5 h-5" */
  className?: string;
  /** Stroke width for outlined icons. Default: 2 */
  strokeWidth?: number;
}

const paths: Record<IconName, { d: string; filled?: boolean }> = {
  star: {
    d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
    filled: true,
  },
  shield: {
    d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  bolt: {
    d: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  check: {
    d: "M5 13l4 4L19 7",
  },
  alert: {
    d: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  beaker: {
    d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  dollar: {
    d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  "chevron-down": {
    d: "M19 9l-7 7-7-7",
  },
  image: {
    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
};

export default function Icon({ name, className = "w-5 h-5", strokeWidth = 2 }: IconProps) {
  const { d, filled } = paths[name];
  const viewBox = filled ? "0 0 20 20" : "0 0 24 24";

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? undefined : "currentColor"}
      aria-hidden="true"
    >
      <path
        d={d}
        strokeLinecap={filled ? undefined : "round"}
        strokeLinejoin={filled ? undefined : "round"}
        strokeWidth={filled ? undefined : strokeWidth}
      />
    </svg>
  );
}
