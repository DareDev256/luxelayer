const services = [
  {
    title: "Countertop Protection",
    description:
      "Full-surface PPF application for kitchen and bathroom countertops. Crystal-clear, self-healing film that's invisible to the eye.",
    features: [
      "Scratch & impact resistance",
      "Stain & etch prevention",
      "UV protection against yellowing",
      "Self-healing technology",
    ],
    tag: "Most Popular",
  },
  {
    title: "Island & Bar Top Shield",
    description:
      "High-traffic surfaces get the most abuse. Our premium film handles hot pots, spilled wine, and daily wear without a mark.",
    features: [
      "Heat resistant up to 300°F",
      "Food-safe certified",
      "Anti-microbial surface",
      "Seamless edge wrapping",
    ],
    tag: null,
  },
  {
    title: "Premium Surface Care",
    description:
      "Complete surface assessment, deep cleaning, and PPF application. We prep, protect, and maintain — your countertops stay showroom-fresh.",
    features: [
      "Surface condition assessment",
      "Professional deep clean",
      "Precision PPF installation",
      "Annual maintenance plan",
    ],
    tag: "Full Service",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Protection That&apos;s Invisible, Performance That&apos;s Not
          </h2>
          <p className="text-warm-gray/50 max-w-2xl mx-auto">
            Professional-grade PPF engineered for interior surfaces. See-through
            protection that lets the natural beauty of your countertops shine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="relative bg-charcoal border border-white/5 rounded-lg p-8 hover:border-gold/30 transition-all duration-300 hover:border-glow group"
            >
              {service.tag && (
                <span className="absolute -top-3 left-6 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded">
                  {service.tag}
                </span>
              )}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-warm-gray/50 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-warm-gray/70 text-sm"
                  >
                    <svg
                      className="w-4 h-4 text-gold shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
