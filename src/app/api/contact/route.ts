import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";

/* ─── Rate Limiter ───────────────────────────────────────── */

/**
 * Simple sliding-window rate limiter keyed on IP.
 * In-memory — resets on redeploy. Good enough for a landing page;
 * upgrade to Upstash/Redis if this ever sees real traffic volume.
 */
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // per window per IP

const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  // Prevent memory leak — evict stale IPs every 1000 entries
  if (hits.size > 1000) {
    for (const [key, ts] of hits) {
      if (ts.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
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

  // ── Process submission ──
  // TODO: Forward result.data to email service / CRM.
  // result.data is fully sanitised — safe to pass downstream.
  console.info("[contact] submission from", ip, result.data.email);

  return NextResponse.json({ ok: true }, { status: 200 });
}
