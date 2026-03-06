import Icon, { type IconName } from "./Icon";
import SectionHeader from "./SectionHeader";

const problems: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "alert",
    title: "Scratches & Scuffs",
    description:
      "Daily use leaves permanent marks on marble, quartz, and granite. Knife slides, pot drags, and everyday contact damage your countertops.",
  },
  {
    icon: "beaker",
    title: "Stains & Etching",
    description:
      "Wine, lemon juice, coffee, and oils penetrate natural stone. Once etched, professional restoration costs $500-2,000+.",
  },
  {
    icon: "dollar",
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
              <div className="text-gold mb-4">
                <Icon name={problem.icon} className="w-8 h-8" strokeWidth={1.5} />
              </div>
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
