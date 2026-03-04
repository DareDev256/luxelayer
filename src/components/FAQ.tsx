"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is surface protection film?",
    answer:
      "It's a clear, thermoplastic urethane film originally developed for aerospace use. We've adapted it specifically for interior surfaces like countertops and islands. It's virtually invisible, self-healing (minor scratches disappear with heat), and provides a physical barrier against scratches, stains, etching, and UV damage.",
  },
  {
    question: "Will the film change how my countertop looks or feels?",
    answer:
      "No. Our premium film is optically clear with a natural matte or gloss finish that matches your surface. You can't see it, and the texture feels like the natural stone underneath. Guests won't know it's there unless you tell them.",
  },
  {
    question: "How long does the protection last?",
    answer:
      "Our premium protection film lasts 7-10 years under normal residential use, backed by our warranty. Commercial installations in high-traffic environments typically last 5-7 years. The film can be removed and replaced without damaging the surface underneath.",
  },
  {
    question: "Is the film food-safe?",
    answer:
      "Yes. Our protection film is FDA-compliant and food-safe certified. It's non-toxic, BPA-free, and safe for direct food contact. Perfect for kitchen countertops and food prep surfaces.",
  },
  {
    question: "Can I still use my countertop normally?",
    answer:
      "Absolutely. Cut on it, place hot pots (up to 300°F), spill wine — the film handles it all. The only thing we recommend avoiding is direct contact with open flames. Use your surfaces exactly as you would without the film.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Pricing depends on surface area, material type, and complexity (edges, cutouts, backsplashes). Most residential kitchens range from $800-2,500. We provide free in-home consultations with exact pricing — no surprises.",
  },
  {
    question: "What if the film gets damaged?",
    answer:
      "Minor scratches self-heal with warm water or a heat gun. For deeper damage, we can replace individual sections without redoing the entire surface. Our annual maintenance plans include inspection and spot repairs.",
  },
  {
    question: "Do you service commercial properties?",
    answer:
      "Yes. We protect surfaces in restaurants, hotels, offices, and retail spaces. Commercial-grade film with enhanced durability is available for high-traffic environments. Volume pricing applies.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 bg-charcoal">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-4">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Common Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/5 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-charcoal-light transition-colors"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gold shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-warm-gray/60 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
