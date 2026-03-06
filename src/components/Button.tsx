import { type ComponentPropsWithoutRef } from "react";

/* ─── Variant × Size token map ─────────────────────────────── */

const variants = {
  primary:
    "bg-gold text-charcoal font-semibold hover:bg-gold-light transition-colors duration-200",
  ghost:
    "border border-white/20 text-warm-gray font-semibold hover:border-gold/50 hover:text-gold transition-colors duration-200",
} as const;

const sizes = {
  sm: "text-sm px-5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-lg px-8 py-3.5",
} as const;

/* ─── Shared props ─────────────────────────────────────────── */

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface SharedProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/* ─── Polymorphic types ────────────────────────────────────── */

type AnchorProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"a">, "className"> & {
    href: string;
    className?: string;
  };

type ButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, "className"> & {
    href?: never;
    className?: string;
  };

type Props = AnchorProps | ButtonProps;

/* ─── Component ────────────────────────────────────────────── */

/**
 * Polymorphic CTA button — renders `<a>` when `href` is provided,
 * `<button>` otherwise. Centralises the gold/ghost design tokens
 * so every call-to-action stays visually consistent site-wide.
 */
export default function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: Props) {
  const base = "rounded inline-flex items-center justify-center gap-2";
  const classes = [
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href) {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
