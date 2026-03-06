"use client";

import { useState } from "react";
import Icon from "./Icon";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

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
    <Section id="faq" variant="muted" maxWidth="3xl">
      <SectionHeader label="FAQ" title="Common Questions" />

      <div className="space-y-3" role="list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const triggerId = `faq-trigger-${index}`;

          return (
            <div
              key={index}
              className="border border-white/5 rounded-lg overflow-hidden"
              role="listitem"
            >
              <button
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-charcoal-light transition-colors"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <Icon
                  name="chevron-down"
                  className={`w-5 h-5 text-gold shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="grid transition-[grid-template-rows] duration-200 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-warm-gray/60 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
