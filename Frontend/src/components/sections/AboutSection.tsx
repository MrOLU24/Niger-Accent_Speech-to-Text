import { Globe, MessageSquare, Zap, Headphones } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Globe,
      title: "Cultural Intelligence",
      description: "Trained on diverse Nigerian speech patterns from Lagos to Kano, understanding regional variations and cultural context.",
      gradient: "from-[#0db2f3] to-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Pidgin Mastery",
      description: "First-class support for Nigerian Pidgin with deep understanding of its grammar, expressions, and cultural significance.",
      gradient: "from-blue-500 to-[#0db2f3]"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Lightning-fast transcription with live editing capabilities. See your words appear as you speak with minimal latency.",
      gradient: "from-[#0db2f3] to-blue-600"
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

    // Animate features
    tl.fromTo(featuresRef.current?.children || [], {
      x: -50,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.4");

    // Animate demo
    tl.fromTo(demoRef.current, {
      x: 50,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6");

  }, { scope: containerRef });

  useGSAP(() => {
    // Floating animation for feature icons
    gsap.to(".feature-icon", {
      y: -5,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    });
  });

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#0e0f16] via-[#0e0f16]/95 to-[#0e0f16] dark:from-[#0e0f16] dark:via-[#0e0f16]/95 dark:to-[#0e0f16] light:from-white light:via-gray-50 light:to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#0db2f3]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 md:mb-6">
            Built for Nigerian voices,
            <span className="block bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
              powered by AI
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-3xl mx-auto">
            We understand the unique linguistic patterns, cultural context, and
            speech nuances that make Nigerian communication special. Our AI
            doesn&apos;t just hear words—it understands meaning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div ref={featuresRef} className="space-y-6 md:space-y-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 dark:bg-white/5 light:bg-white/80 rounded-2xl border border-[#0db2f3]/20 backdrop-blur-sm hover:bg-white/10 hover:border-[#0db2f3]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#0db2f3]/20"
              >
                <div className={`feature-icon flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg shadow-[#0db2f3]/30 group-hover:shadow-xl group-hover:shadow-[#0db2f3]/40 transition-all duration-300`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white dark:text-white light:text-gray-900 mb-2 group-hover:text-[#0db2f3] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 dark:text-gray-300 light:text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div ref={demoRef} className="relative">
            <div className="space-y-4 p-6 md:p-8 bg-white/5 dark:bg-white/5 light:bg-white/80 rounded-2xl border border-[#0db2f3]/20 backdrop-blur-sm hover:shadow-xl hover:shadow-[#0db2f3]/20 transition-all duration-300">
              <div className="flex items-center gap-3 text-[#0db2f3]">
                <div className="w-2 h-2 rounded-full bg-[#0db2f3] animate-pulse"></div>
                <span className="text-sm font-medium">Processing demo</span>
              </div>
              <div className="space-y-3 text-gray-300 dark:text-gray-300 light:text-gray-600">
                <p className="border-l-4 border-[#0db2f3] pl-4 hover:bg-[#0db2f3]/10 transition-colors duration-300 rounded-r-lg py-2">
                  &ldquo;Wetin dey happen for this Lagos traffic?&rdquo;
                </p>
                <p className="border-l-4 border-blue-500 pl-4 hover:bg-blue-500/10 transition-colors duration-300 rounded-r-lg py-2">
                  &ldquo;The meeting go start by 3 o&apos;clock.&rdquo;
                </p>
                <p className="border-l-4 border-[#0db2f3] pl-4 hover:bg-[#0db2f3]/10 transition-colors duration-300 rounded-r-lg py-2">
                  &ldquo;Make we discuss the project details.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 bg-[#0db2f3]/10 p-3 rounded-lg">
                <Headphones className="w-4 h-4 text-[#0db2f3]" />
                <span>Accuracy: <span className="text-[#0db2f3] font-semibold">99.2%</span> • Response: <span className="text-[#0db2f3] font-semibold">50ms</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
