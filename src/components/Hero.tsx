import type { CSSProperties } from "react";
import Image from "next/image";
import Button from "./Button";
import Icon from "./Icon";

/** Inline style to set the stagger delay CSS custom property. */
const stagger = (s: number): CSSProperties =>
  ({ "--delay": `${s}s` }) as CSSProperties;

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
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in-up"
          style={stagger(0.2)}
        >
          Invisible Armor for
          <br />
          <span className="text-gradient-gold">Luxury Surfaces</span>
        </h1>
        <p
          className="text-lg md:text-xl text-warm-gray/80 max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={stagger(0.4)}
        >
          Professional-grade protection film for countertops, islands, and
          premium surfaces. Your investment stays flawless — no scratches, no
          stains, no worry.
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={stagger(0.6)}
        >
          <Button href="#contact" size="lg" className="w-full sm:w-auto">
            Book a Consultation
          </Button>
          <Button href="#how-it-works" variant="ghost" size="lg" className="w-full sm:w-auto">
            See How It Works
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-warm-gray/60 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="star" className="w-5 h-5 text-gold" />
            5-Star Rated
          </div>
          <div className="flex items-center gap-2">
            <Icon name="shield" className="w-5 h-5 text-gold" />
            10-Year Warranty
          </div>
          <div className="flex items-center gap-2">
            <Icon name="bolt" className="w-5 h-5 text-gold" />
            Self-Healing Film
          </div>
        </div>
      </div>
    </section>
  );
}
