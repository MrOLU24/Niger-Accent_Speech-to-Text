# Landing Page Sections

This directory contains all the modular sections of the landing page.

## Components

- **HeroSection.tsx** - Main hero section with title, CTA buttons, and feature highlights
- **StatsSection.tsx** - Statistics display (users, accuracy, languages, etc.)
- **AboutSection.tsx** - About section explaining the AI's capabilities
- **FeaturesSection.tsx** - Grid of feature cards
- **TestimonialsSection.tsx** - Customer testimonials with Swiper carousel
- **CTASection.tsx** - Call-to-action section at the bottom

## Usage

All components are exported via the `index.ts` barrel file for clean imports:

```tsx
import { HeroSection, StatsSection, AboutSection } from "@/components/sections";
```

## Structure

Each section is:
- Self-contained with its own imports
- Responsive across all device sizes
- Uses consistent spacing and design tokens
- Follows the established design system

## Dependencies

- **Lucide React** - Icons
- **Next.js Image** - Optimized images
- **Swiper** - Carousel functionality (TestimonialsSection only)
- **Tailwind CSS** - Styling
