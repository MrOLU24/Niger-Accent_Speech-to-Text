import {
  Mic,
  Zap,
  Globe,
  Users,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Mic,
      title: "Studio-Quality Recording",
      description: "Crystal clear audio capture with noise cancellation and automatic gain control for professional results.",
      gradient: "from-[#0db2f3] to-blue-500"
    },
    {
      icon: Zap,
      title: "Lightning-Fast Processing",
      description: "Real-time transcription with industry-leading speed. Process hours of content in minutes, not hours.",
      gradient: "from-blue-500 to-[#0db2f3]"
    },
    {
      icon: Globe,
      title: "Multi-Dialect Support",
      description: "Comprehensive coverage of Nigerian English variants, Pidgin, and major local languages with cultural context.",
      gradient: "from-[#0db2f3] to-blue-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share projects, collaborate in real-time, and manage team access with enterprise-grade security.",
      gradient: "from-blue-600 to-[#0db2f3]"
    },
    {
      icon: MessageSquare,
      title: "Smart Editing",
      description: "AI-powered editing suggestions, automatic punctuation, and intelligent formatting for polished output.",
      gradient: "from-[#0db2f3] to-blue-500"
    },
    {
      icon: ArrowRight,
      title: "Export Anywhere",
      description: "Multiple format support including SRT, VTT, Word, PDF, and direct integration with popular platforms.",
      gradient: "from-blue-500 to-[#0db2f3]"
    },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate heading
    tl.fromTo(headingRef.current, {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });

    // Animate feature cards
    tl.fromTo(gridRef.current?.children || [], {
      y: 80,
      opacity: 0,
      scale: 0.8
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.4");

  }, { scope: containerRef });

  useGSAP(() => {
    // Floating animation for feature icons
    gsap.to(".feature-card-icon", {
      y: -8,
      rotation: 5,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.4
    });
  });

  return (
    <section 
      ref={containerRef}
      id="features" 
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#0e0f16]/80 via-[#0e0f16] to-[#0e0f16]/80 dark:from-[#0e0f16]/80 dark:via-[#0e0f16] dark:to-[#0e0f16]/80 light:from-gray-50 light:via-white light:to-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(13,178,243,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 md:mb-6">
            Everything you need for
            <span className="block bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
              voice transformation
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-3xl mx-auto">
            From podcasters to journalists, content creators to businesses—our
            platform scales with your needs.
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-6 md:p-8 bg-white/5 dark:bg-white/5 light:bg-white/80 rounded-2xl border border-[#0db2f3]/20 backdrop-blur-sm hover:bg-white/10 hover:border-[#0db2f3]/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#0db2f3]/20 cursor-pointer"
            >
              <div className={`feature-card-icon w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-[#0db2f3]/30 group-hover:shadow-xl group-hover:shadow-[#0db2f3]/40 transition-all duration-500`}>
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white dark:text-white light:text-gray-900 mb-3 md:mb-4 group-hover:text-[#0db2f3] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-300 dark:text-gray-300 light:text-gray-600 group-hover:text-gray-200 dark:group-hover:text-gray-200 light:group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0db2f3]/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
