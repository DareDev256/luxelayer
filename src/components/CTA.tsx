"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Section from "./Section";
import Button from "./Button";
import { validateContactForm, type ValidationError } from "@/lib/validation";

/**
 * Minimum time (ms) a human needs to fill the form. Bots submit instantly;
 * real users need at least a few seconds to type name + email + select.
 * 3 seconds is generous — most humans take 15-30s.
 */
const MIN_SUBMIT_MS = 3000;

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationError[]>([]);
  const loadedAt = useRef(0);

  // Capture mount timestamp in an effect (pure render — no Date.now in body)
  useEffect(() => { loadedAt.current = Date.now(); }, []);

  /** Look up first error for a given field name */
  const errorFor = useCallback(
    (field: string) => fieldErrors.find((e) => e.field === field)?.message,
    [fieldErrors],
  );

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors([]);
    setServerError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — hidden field that humans never fill, bots auto-complete
    if (data.get("website")) return;

    // Timing gate — reject instant submissions (bot behavior)
    if (Date.now() - loadedAt.current < MIN_SUBMIT_MS) return;

    // ── Client-side validation (fast feedback) ──
    const result = validateContactForm({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      surface: data.get("surface"),
      message: data.get("message"),
    });

    if (!result.valid) {
      setFieldErrors(result.errors);
      return;
    }

    // ── Submit to server-validated API route ──
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <Section id="contact" maxWidth="4xl" className="text-center">
      <div className="bg-gradient-to-b from-charcoal-light to-charcoal border border-gold/20 rounded-2xl p-12 md:p-16 border-glow">
        <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-4">
          Ready to Protect Your Investment?
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Get Your Free Consultation
        </h2>
        <p className="text-warm-gray/50 max-w-xl mx-auto mb-10 text-lg">
          We&apos;ll assess your surfaces, provide an exact quote, and show
          you how LuxeLayer keeps your countertops flawless for years to come.
        </p>

        {submitted ? (
          <div className="max-w-md mx-auto py-12" role="status">
            <p className="text-gold text-xl font-semibold mb-2">Thank you!</p>
            <p className="text-warm-gray/50">We&apos;ll be in touch within 24 hours.</p>
          </div>
        ) : (
        <form
          className="max-w-md mx-auto space-y-4"
          onSubmit={handleSubmit}
          noValidate={false}
        >
          {/* Honeypot — invisible to humans, irresistible to bots */}
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <label htmlFor="website">Do not fill this</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {serverError && (
            <div role="alert" className="text-red-400 text-sm text-left">
              <p>{serverError}</p>
            </div>
          )}
          {fieldErrors.length > 0 && (
            <div role="alert" className="text-red-400 text-sm text-left space-y-1">
              {fieldErrors.map((err) => (
                <p key={err.field}>{err.message}</p>
              ))}
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            maxLength={100}
            autoComplete="name"
            pattern="[A-Za-z\s\-'.]{1,100}"
            title="Letters, spaces, hyphens, and apostrophes only"
            aria-invalid={!!errorFor("name")}
            aria-describedby={errorFor("name") ? "err-name" : undefined}
            className={`input-field ${errorFor("name") ? "border-red-400/60" : ""}`}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            maxLength={254}
            autoComplete="email"
            aria-invalid={!!errorFor("email")}
            aria-describedby={errorFor("email") ? "err-email" : undefined}
            className={`input-field ${errorFor("email") ? "border-red-400/60" : ""}`}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            maxLength={20}
            autoComplete="tel"
            pattern="[\d\s\-\+\(\)]{7,20}"
            title="Valid phone number (digits, spaces, dashes, parentheses)"
            aria-invalid={!!errorFor("phone")}
            className={`input-field ${errorFor("phone") ? "border-red-400/60" : ""}`}
          />
          <select
            name="surface"
            required
            aria-invalid={!!errorFor("surface")}
            className={`input-field text-warm-gray/50 ${errorFor("surface") ? "border-red-400/60" : ""}`}
          >
            <option value="">Surface Type</option>
            <option value="marble">Marble</option>
            <option value="quartz">Quartz</option>
            <option value="granite">Granite</option>
            <option value="quartzite">Quartzite</option>
            <option value="porcelain">Porcelain</option>
            <option value="solid-surface">Solid Surface</option>
            <option value="other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Tell us about your project (surface size, location, concerns)..."
            rows={4}
            maxLength={1000}
            className="input-field resize-none"
          />
          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            {submitting ? "Sending\u2026" : "Request Free Quote"}
          </Button>
        </form>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-warm-gray/40 text-sm">
          <span>Free in-home assessment</span>
          <span className="hidden sm:inline">|</span>
          <span>No-obligation quote</span>
          <span className="hidden sm:inline">|</span>
          <span>Same-week availability</span>
        </div>
      </div>
    </Section>
  );
}
