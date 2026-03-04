import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/gallery-1.jpg"
          alt="Luxury exotic granite countertop protected by LuxeLayer"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-6 animate-fade-in-up">
          Premium Surface Protection
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in-up-delay-1">
          Invisible Armor for
          <br />
          <span className="text-gradient-gold">Luxury Surfaces</span>
        </h1>
        <p className="text-lg md:text-xl text-warm-gray/80 max-w-2xl mx-auto mb-10 animate-fade-in-up-delay-2">
          Professional-grade Paint Protection Film for countertops, islands, and
          premium surfaces. Your investment stays flawless — no scratches, no
          stains, no worry.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
          <a
            href="#contact"
            className="bg-gold text-charcoal font-semibold px-8 py-3.5 rounded text-lg hover:bg-gold-light transition-colors duration-200 w-full sm:w-auto"
          >
            Book a Consultation
          </a>
          <a
            href="#how-it-works"
            className="border border-white/20 text-warm-gray px-8 py-3.5 rounded text-lg hover:border-gold/50 hover:text-gold transition-colors duration-200 w-full sm:w-auto"
          >
            See How It Works
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-warm-gray/60 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            5-Star Rated
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            10-Year Warranty
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Self-Healing Film
          </div>
        </div>
      </div>
    </section>
  );
}
