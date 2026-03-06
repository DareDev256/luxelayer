/**
 * Email delivery via the Resend REST API.
 *
 * Uses raw `fetch` — no npm dependency required. Resend's API is a single
 * POST endpoint; adding a package for that would be over-engineering.
 *
 * Environment:
 *   RESEND_API_KEY  — required for delivery (skips gracefully if missing)
 *   CONTACT_TO      — recipient address (defaults to RESEND_API_KEY owner's domain)
 *
 * This module is server-only — never import from client components.
 */

import type { ContactFormData } from "./validation";

const RESEND_URL = "https://api.resend.com/emails";

interface SendResult {
  success: boolean;
  /** Resend message ID on success, error message on failure */
  detail: string;
}

/**
 * Format contact form data into a clean HTML email body.
 * No external template engine — the data is already sanitised by validation.ts.
 */
function buildEmailHtml(data: ContactFormData): string {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Surface", data.surface],
    ["Message", data.message || "—"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#9ca3af;vertical-align:top">${label}</td>` +
        `<td style="padding:8px 12px;color:#f5f5f5">${value}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#1a1a1a;border-radius:8px;overflow:hidden">
      <div style="background:#b8860b;padding:16px 24px">
        <h2 style="margin:0;color:#1a1a1a;font-size:18px">New LuxeLayer Consultation Request</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${tableRows}</table>
      <div style="padding:12px 24px;color:#6b7280;font-size:12px;border-top:1px solid #2a2a2a">
        Reply directly to <a href="mailto:${data.email}" style="color:#b8860b">${data.email}</a>
      </div>
    </div>`;
}

/**
 * Send a contact form submission via Resend.
 *
 * Designed for fire-and-forget: never throws. Returns a result object
 * so the caller can log failures without crashing the request.
 */
export async function sendContactEmail(
  data: ContactFormData,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      detail: "RESEND_API_KEY not configured — email skipped",
    };
  }

  const to = process.env.CONTACT_TO ?? "delivered@resend.dev";
  const from = process.env.CONTACT_FROM ?? "LuxeLayer <onboarding@resend.dev>";

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `Consultation request — ${data.surface} — ${data.name}`,
        html: buildEmailHtml(data),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "unreadable");
      return { success: false, detail: `Resend ${res.status}: ${body}` };
    }

    const json = (await res.json()) as { id?: string };
    return { success: true, detail: json.id ?? "sent" };
  } catch (err) {
    return {
      success: false,
      detail: err instanceof Error ? err.message : "Unknown fetch error",
    };
  }
}
