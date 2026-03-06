"use client";

import { useState, useMemo } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

const navLinks = [
  { label: "Services", href: "#services", id: "services" },
  { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
  { label: "Surfaces", href: "#surfaces", id: "surfaces" },
  { label: "Gallery", href: "#gallery", id: "gallery" },
  { label: "FAQ", href: "#faq", id: "faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIds = useMemo(() => navLinks.map((l) => l.id), []);
  const activeSection = useActiveSection(sectionIds);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tight">
          <span className="text-gradient-gold">Luxe</span>
          <span className="text-white">Layer</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm py-1 transition-colors duration-300"
                style={{
                  color: isActive
                    ? "var(--color-gold)"
                    : "rgb(245 240 232 / 0.5)",
                }}
              >
                {link.label}
                {/* Gold underline indicator — slides in/out */}
                <span
                  className="absolute -bottom-0.5 left-0 h-[2px] bg-gold transition-all duration-300 ease-out"
                  style={{
                    width: isActive ? "100%" : "0%",
                    opacity: isActive ? 1 : 0,
                  }}
                  aria-hidden="true"
                />
              </a>
            );
          })}
          <a
            href="#contact"
            className="text-sm bg-gold text-charcoal font-semibold px-5 py-2 rounded hover:bg-gold-light transition-colors duration-200"
          >
            Get a Quote
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-warm-gray"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden bg-charcoal border-t border-white/5 px-6 py-4 flex flex-col gap-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 flex items-center gap-2"
                style={{
                  color: isActive
                    ? "var(--color-gold)"
                    : "rgb(245 240 232 / 0.5)",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {/* Active dot indicator for mobile */}
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gold transition-all duration-300"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scale(1)" : "scale(0)",
                  }}
                  aria-hidden="true"
                />
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            className="bg-gold text-charcoal font-semibold px-5 py-2 rounded text-center hover:bg-gold-light transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Get a Quote
          </a>
        </nav>
      )}
    </header>
  );
}
