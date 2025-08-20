"use client";

import {
  HeroSection,
  StatsSection,
  AboutSection,
  FeaturesSection,
  TestimonialsSection,
  CTASection,
  Footer,
} from "@/components/sections";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-foreground bg-background">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}