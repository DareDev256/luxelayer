import SectionHeader from "./SectionHeader";

const steps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We assess your surfaces, discuss your needs, and provide a detailed quote. In-home or virtual — your choice.",
  },
  {
    number: "02",
    title: "Surface Prep",
    description:
      "Professional deep cleaning and surface preparation. Any existing damage is documented and addressed before film application.",
  },
  {
    number: "03",
    title: "Precision Application",
    description:
      "Custom-cut protection film applied by hand with zero bubbles, zero seams. Edge-to-edge coverage with invisible protection.",
  },
  {
    number: "04",
    title: "Quality Inspection",
    description:
      "Final walkthrough together. We verify every inch, demonstrate the self-healing properties, and hand over your care guide.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-charcoal">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="The Process"
          title="How It Works"
          description="From consultation to completion, your surfaces are protected in as little as one day."
        />

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-gold/30 to-gold/5" />
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-gold/30 mb-6">
                  <span className="text-gold font-bold text-lg">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-warm-gray/50 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
