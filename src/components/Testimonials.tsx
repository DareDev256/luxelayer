import Icon from "./Icon";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

const testimonials = [
  {
    quote:
      "We just renovated our kitchen with Calacatta marble and were terrified of the first scratch. LuxeLayer made it invisible — we use our kitchen without fear now.",
    name: "Sarah M.",
    title: "Homeowner, Toronto",
    stars: 5,
  },
  {
    quote:
      "Our restaurant bar top sees hundreds of glasses a night. After LuxeLayer, the granite still looks like day one. Best investment we've made.",
    name: "Marcus D.",
    title: "Restaurant Owner",
    stars: 5,
  },
  {
    quote:
      "I was skeptical about film on stone, but you genuinely cannot see it. My quartz countertops are fully protected and look completely natural.",
    name: "Jennifer L.",
    title: "Interior Designer",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <Section>
      <SectionHeader
        label="Testimonials"
        title="Trusted by Homeowners & Businesses"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="bg-charcoal border border-white/5 rounded-lg p-8"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.stars }).map((_, i) => (
                <Icon key={i} name="star" className="w-4 h-4 text-gold" />
              ))}
            </div>
            <p className="text-warm-gray/70 leading-relaxed mb-6 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-warm-gray/40 text-xs">{testimonial.title}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
