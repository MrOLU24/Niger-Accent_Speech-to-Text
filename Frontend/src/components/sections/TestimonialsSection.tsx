"use client";

import { Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Swiper: no SSR
const SwiperComponent = dynamic(() => import("./SwiperTestimonials"), {
  ssr: false,
  loading: () => <TestimonialsFallback />,
});

// SSR/loading fallback
function TestimonialsFallback() {
  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Podcast Host & Content Creator",
      content:
        "ToriType revolutionized my workflow. It perfectly captures my Lagos accent and even understands when I switch to Pidgin mid-conversation. The accuracy is incredible!",
      avatar: "adebayo",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-500",
    },
    {
      name: "Fatima Ibrahim",
      role: "Journalist, Premium Times",
      content:
        "As a journalist covering diverse communities, I need transcription that understands context. ToriType's cultural intelligence is unmatched—it gets the nuances that others miss.",
      avatar: "fatima",
      rating: 5,
      gradient: "from-blue-500 to-[#0db2f3]",
    },
    {
      name: "Chinedu Okafor",
      role: "YouTube Creator, 2M+ subscribers",
      content:
        "From interviews to vlogs, ToriType handles everything. The real-time transcription during live streams is a game-changer. My audience loves the instant captions!",
      avatar: "chinedu",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-16">
      {testimonials.map((testimonial, i) => (
        <div
          key={i}
          className="group h-full p-8 bg-white dark:bg-gray-800/50 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500 backdrop-blur-sm"
        >
          {/* Stars */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(testimonial.rating)].map((_, starIndex) => (
              <Star
                key={starIndex}
                className="w-5 h-5 fill-[#0db2f3] text-[#0db2f3]"
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-base">
            &ldquo;{testimonial.content}&rdquo;
          </p>

          {/* Avatar & user info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#0db2f3] to-blue-500 flex items-center justify-center text-white font-bold text-base shadow-lg">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                {testimonial.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      ref={containerRef}
      id="testimonials"
      className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0e0f16] dark:via-[#1a1b23] dark:to-[#0e0f16] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#0db2f3]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Trusted by creators
            <span className="block bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent mt-2">
              across Nigeria
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real stories from real users who are transforming their work with
            Nigerian speech recognition
          </p>
        </div>

        {/* Render Swiper only on client side */}
        {isClient ? <SwiperComponent /> : <TestimonialsFallback />}
      </div>
    </section>
  );
}
