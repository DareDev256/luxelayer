import Section from "./Section";

export default function CTA() {
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

        <form className="max-w-md mx-auto space-y-4" action="#contact" method="POST">
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
          <button
            type="submit"
            className="w-full bg-gold text-charcoal font-semibold py-3.5 rounded text-lg hover:bg-gold-light transition-colors duration-200"
          >
            Request Free Quote
          </button>
        </form>

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
