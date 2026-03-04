const surfaces = [
  {
    name: "Marble",
    description: "Calacatta, Carrara, Statuario — protect the veining you fell in love with.",
    risk: "High porosity, etches easily from acids",
  },
  {
    name: "Quartz",
    description: "Engineered stone stays pristine longer with an added layer of defense.",
    risk: "Susceptible to heat marks and deep scratches",
  },
  {
    name: "Granite",
    description: "Natural granite's beauty preserved with invisible protection.",
    risk: "Porous surface absorbs oils and stains",
  },
  {
    name: "Quartzite",
    description: "One of nature's hardest stones, now with surface-level scratch protection.",
    risk: "Can still etch from acidic liquids",
  },
  {
    name: "Porcelain",
    description: "Sintered surfaces get chip and scratch protection at the edges.",
    risk: "Prone to chipping at edges and seams",
  },
  {
    name: "Solid Surface",
    description: "Corian and similar surfaces protected from scratches and heat damage.",
    risk: "Easily scratched, shows knife marks",
  },
];

export default function SurfaceTypes() {
  return (
    <section id="surfaces" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-4">
            We Protect
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Every Premium Surface
          </h2>
          <p className="text-warm-gray/50 max-w-2xl mx-auto">
            Our protection film is engineered for the unique challenges of each material.
            Tailored protection for every surface type.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {surfaces.map((surface) => (
            <div
              key={surface.name}
              className="bg-charcoal border border-white/5 rounded-lg p-6 hover:border-gold/20 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-2 text-gold">
                {surface.name}
              </h3>
              <p className="text-warm-gray/60 text-sm mb-3">
                {surface.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-warm-gray/40">
                <svg
                  className="w-3.5 h-3.5 text-red-400/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Without protection: {surface.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
