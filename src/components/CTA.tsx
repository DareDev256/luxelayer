"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Section from "./Section";
import Button from "./Button";

/**
 * Minimum time (ms) a human needs to fill the form. Bots submit instantly;
 * real users need at least a few seconds to type name + email + select.
 * 3 seconds is generous — most humans take 15-30s.
 */
const MIN_SUBMIT_MS = 3000;

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const loadedAt = useRef(0);

  // Capture mount timestamp in an effect (pure render — no Date.now in body)
  useEffect(() => { loadedAt.current = Date.now(); }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — hidden field that humans never fill, bots auto-complete
    if (data.get("website")) return;

    // Timing gate — reject instant submissions (bot behavior)
    if (Date.now() - loadedAt.current < MIN_SUBMIT_MS) return;

    // TODO: Wire to API route / email service. For now, show confirmation.
    setSubmitted(true);
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

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            maxLength={100}
            autoComplete="name"
            pattern="[A-Za-z\s\-'.]{1,100}"
            title="Letters, spaces, hyphens, and apostrophes only"
            className="input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            maxLength={254}
            autoComplete="email"
            className="input-field"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            maxLength={20}
            autoComplete="tel"
            pattern="[\d\s\-\+\(\)]{7,20}"
            title="Valid phone number (digits, spaces, dashes, parentheses)"
            className="input-field"
          />
          <select
            name="surface"
            required
            className="input-field text-warm-gray/50"
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
          <Button type="submit" size="lg" fullWidth>
            Request Free Quote
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
