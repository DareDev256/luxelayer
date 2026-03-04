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
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by Homeowners & Businesses
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-charcoal border border-white/5 rounded-lg p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
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
      </div>
    </section>
  );
}
