/**
 * Isomorphic contact-form validation — runs on client AND server.
 *
 * Why this exists:
 * HTML5 pattern/required attributes are browser-only and trivially bypassed.
 * This module provides programmatic validation so the same rules execute in
 * handleSubmit (client) and the future API route (server). No external deps.
 *
 * Security controls:
 * - Input trimming + length caps (prevents megabyte payloads)
 * - Regex validation (rejects malformed data before it touches any service)
 * - Surface allowlist (prevents injection via supposedly-constrained select)
 * - Strips control characters (null bytes, vertical tabs, etc.)
 */

/* ─── Constants ───────────────────────────────────────────── */

/** Allowlisted surface values — must match <select> options in CTA.tsx */
export const VALID_SURFACES = [
  "marble",
  "quartz",
  "granite",
  "quartzite",
  "porcelain",
  "solid-surface",
  "other",
] as const;

export type SurfaceType = (typeof VALID_SURFACES)[number];

/** RFC 5321 max local+domain length */
const MAX_EMAIL = 254;
const MAX_NAME = 100;
const MAX_PHONE = 20;
const MAX_MESSAGE = 1000;

/* ─── Patterns ────────────────────────────────────────────── */

/** Letters, spaces, hyphens, apostrophes, periods — covers international-ish names */
const NAME_RE = /^[A-Za-z\s\-'.]{1,100}$/;

/**
 * Practical email regex — not RFC 5322 complete (that's 6k chars) but catches
 * 99.9% of valid addresses and rejects obvious injection attempts.
 * ASCII-only to block unicode homoglyph phishing (Cyrillic 'а' ≠ Latin 'a').
 */
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

/** Rejects any non-ASCII characters — catches homoglyph/IDN phishing */
const ASCII_ONLY_RE = /^[\x20-\x7E]*$/;

/** Digits, spaces, dashes, plus, parens — international phone formats */
const PHONE_RE = /^[\d\s\-+()]{7,20}$/;

/** Control characters that have no business in form input */
const CONTROL_CHARS_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/* ─── Types ───────────────────────────────────────────────── */

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  surface: string;
  message: string;
}

export interface ValidationError {
  field: keyof ContactFormData;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  /** Sanitised data — only meaningful when valid is true */
  data: ContactFormData;
}

/* ─── Helpers ─────────────────────────────────────────────── */

/** Trim + strip control characters + collapse to max length */
function sanitise(raw: unknown, max: number): string {
  if (typeof raw !== "string") return "";
  return raw.trim().replace(CONTROL_CHARS_RE, "").slice(0, max);
}

/* ─── Validator ───────────────────────────────────────────── */

/**
 * Validate and sanitise contact form input.
 *
 * Safe to call on both client (FormData) and server (parsed JSON body).
 * Returns sanitised data alongside any validation errors so the caller
 * never touches raw input directly.
 */
export function validateContactForm(
  raw: Record<string, unknown>,
): ValidationResult {
  const errors: ValidationError[] = [];

  const name = sanitise(raw.name, MAX_NAME);
  const email = sanitise(raw.email, MAX_EMAIL);
  const phone = sanitise(raw.phone, MAX_PHONE);
  const surface = sanitise(raw.surface, 30);
  const message = sanitise(raw.message, MAX_MESSAGE);

  // ── Name ──
  if (!name) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (!NAME_RE.test(name)) {
    errors.push({
      field: "name",
      message: "Letters, spaces, hyphens, and apostrophes only",
    });
  }

  // ── Email ──
  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!ASCII_ONLY_RE.test(email)) {
    errors.push({ field: "email", message: "Email must contain only ASCII characters" });
  } else if (!EMAIL_RE.test(email)) {
    errors.push({ field: "email", message: "Enter a valid email address" });
  }

  // ── Phone (optional but must be valid if provided) ──
  if (phone && !PHONE_RE.test(phone)) {
    errors.push({ field: "phone", message: "Enter a valid phone number" });
  }

  // ── Surface (allowlist) ──
  if (!surface) {
    errors.push({ field: "surface", message: "Select a surface type" });
  } else if (!(VALID_SURFACES as readonly string[]).includes(surface)) {
    errors.push({ field: "surface", message: "Invalid surface type" });
  }

  // ── Message (optional, length-capped by sanitise) ──
  // No further validation needed — sanitise already stripped control chars

  return {
    valid: errors.length === 0,
    errors,
    data: { name, email, phone, surface, message },
  };
}
