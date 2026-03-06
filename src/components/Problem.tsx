import SectionHeader from "./SectionHeader";

const problems = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Scratches & Scuffs",
    description:
      "Daily use leaves permanent marks on marble, quartz, and granite. Knife slides, pot drags, and everyday contact damage your countertops.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Stains & Etching",
    description:
      "Wine, lemon juice, coffee, and oils penetrate natural stone. Once etched, professional restoration costs $500-2,000+.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Depreciation",
    description:
      "Damaged countertops reduce home value. Replacement costs $3,000-10,000+ per surface. Prevention is a fraction of that cost.",
  },
];

export default function Problem() {
  return (
    <section className="py-24 px-6 bg-charcoal">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="The Problem"
          title="Your Countertops Are Under Attack"
          description="Every day, your premium surfaces face damage from normal use. Without protection, the damage is permanent and expensive."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bg-charcoal-light border border-white/5 rounded-lg p-8 hover:border-gold/20 transition-colors duration-300"
            >
              <div className="text-gold mb-4">{problem.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-warm-gray/50 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
