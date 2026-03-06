import Image from "next/image";
import SectionHeader from "./SectionHeader";

const galleryItems = [
  {
    title: "Exotic Granite Kitchen Island",
    description:
      "Full protection film on exotic gold & black granite island — mirror finish preserved",
    src: "/gallery-1.jpg",
  },
  {
    title: "Luxury Kitchen — Full View",
    description:
      "Complete countertop and island protection with seamless edge wrapping",
    src: "/gallery-2.jpg",
  },
  {
    title: "Quartz Bathroom Vanity",
    description: "Edge-to-edge protection on double vanity",
    src: null,
  },
  {
    title: "Granite Bar Top",
    description: "Commercial-grade film on entertainment bar",
    src: null,
  },
  {
    title: "Quartzite Dining Surface",
    description: "Full table surface with self-healing film",
    src: null,
  },
  {
    title: "Porcelain Kitchen Counter",
    description: "Seamless application on sintered porcelain",
    src: null,
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 px-6 bg-charcoal">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Our Work"
          title="See the Invisible Difference"
          description="Real projects, real protection. Every surface looks exactly the same — because the best protection is the kind you can't see."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-lg border border-white/5 hover:border-gold/20 transition-colors duration-300"
            >
              {item.src ? (
                <div className="aspect-[4/3] relative">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-charcoal-light flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gold/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-warm-gray/30 text-sm">Coming Soon</p>
                  </div>
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-warm-gray/60 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
