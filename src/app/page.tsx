import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import SurfaceTypes from "@/components/SurfaceTypes";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollReveal>
          <Problem />
        </ScrollReveal>
        <ScrollReveal direction="right" delay={80}>
          <Services />
        </ScrollReveal>
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal direction="left" delay={80}>
          <SurfaceTypes />
        </ScrollReveal>
        <ScrollReveal>
          <Gallery />
        </ScrollReveal>
        <ScrollReveal direction="fade" delay={120}>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={60}>
          <CTA />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
