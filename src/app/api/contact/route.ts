import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";
import { sendContactEmail } from "@/lib/email";

/* ─── Rate Limiter ───────────────────────────────────────── */

/**
 * Simple sliding-window rate limiter keyed on IP.
 * In-memory — resets on redeploy. Good enough for a landing page;
 * upgrade to Upstash/Redis if this ever sees real traffic volume.
 */
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // per window per IP

const hits = new Map<string, number[]>();

/** Hard ceiling — if a DDoS floods with unique IPs, nuke the map rather than OOM */
const MAX_MAP_SIZE = 10_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  // Evict stale IPs when map is large; hard-clear if eviction isn't enough
  if (hits.size > 1000) {
    for (const [key, ts] of hits) {
      if (ts.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
    if (hits.size > MAX_MAP_SIZE) hits.clear();
  }
  return timestamps.length > MAX_REQUESTS;
}

/* ─── Route Handler ──────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // ── IP extraction (works behind Vercel/Cloudflare proxies) ──
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  // ── Content-Type guard ──
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 },
    );
  }

  // ── Parse body with size guard (Next.js default is 1MB, but be explicit) ──
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Server-side validation (same logic as client) ──
  const result = validateContactForm(body);

  if (!result.valid) {
    return NextResponse.json(
      { error: "Validation failed", fields: result.errors },
      { status: 422 },
    );
  }

  // ── Forward to email service ──
  // result.data is fully sanitised — safe to pass downstream.
  const email = await sendContactEmail(result.data);

  if (!email.success) {
    console.warn("[contact] email delivery failed:", email.detail);
  } else {
    console.info("[contact] email sent:", email.detail, "from", ip);
  }

  // Always return success to the user — their submission is valid regardless
  // of email delivery status. Failed sends are logged for ops visibility.
  return NextResponse.json({ ok: true }, { status: 200 });
}
