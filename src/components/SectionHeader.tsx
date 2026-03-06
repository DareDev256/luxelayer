interface SectionHeaderProps {
  /** Gold uppercase label above the title */
  label: string;
  /** Main heading text */
  title: string;
  /** Optional description paragraph below the heading */
  description?: string;
}

/**
 * Shared section header used across all landing page sections.
 * Single source of truth for the gold-label → h2 → description pattern.
 * Automatically omits bottom margin on h2 when no description follows.
 */
export default function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-4">
        {label}
      </p>
      <h2 className={`text-3xl md:text-4xl font-bold${description ? " mb-4" : ""}`}>
        {title}
      </h2>
      {description && (
        <p className="text-warm-gray/50 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
