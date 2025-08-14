import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const stats = [
    { number: "50K+", label: "Active users", sublabel: "Growing daily", icon: "👥" },
    { number: "99.2%", label: "Accuracy rate", sublabel: "Nigerian English", icon: "🎯" },
    { number: "200+", label: "Languages", sublabel: "& dialects", icon: "🌍" },
    { number: "10M+", label: "Hours processed", sublabel: "This month", icon: "⚡" },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate stat cards
    tl.fromTo(gridRef.current?.children || [], {
      y: 60,
      opacity: 0,
      scale: 0.8
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)"
    });

    // Number counting animation
    stats.forEach((stat, index) => {
      const element = gridRef.current?.children[index]?.querySelector('.stat-number');
      if (element) {
        const finalNumber = parseInt(stat.number.replace(/[^\d]/g, ''));
        gsap.fromTo(element, {
          textContent: 0
        }, {
          textContent: finalNumber,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse"
          },
          onUpdate: function() {
            const current = Math.round(this.targets()[0].textContent);
            if (stat.number.includes('+')) {
              element.textContent = current + '+';
            } else if (stat.number.includes('%')) {
              element.textContent = (current / 10).toFixed(1) + '%';
            } else if (stat.number.includes('M')) {
              element.textContent = current + 'M+';
            } else {
              element.textContent = current + '+';
            }
          }
        });
      }
    });

  }, { scope: containerRef });

  useGSAP(() => {
    // Floating animation for stat cards
    gsap.to(".stat-card", {
      y: -5,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.2
    });
  });

  return (
    <section 
      ref={containerRef}
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-r from-[#0db2f3]/10 via-transparent to-blue-500/10 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,178,243,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#0db2f3]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card group text-center p-4 md:p-6 lg:p-8 bg-white/10 dark:bg-white/10 light:bg-white/80 rounded-2xl border border-[#0db2f3]/30 backdrop-blur-sm hover:bg-white/20 hover:border-[#0db2f3]/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#0db2f3]/30 cursor-pointer"
            >
              {/* Icon */}
              <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              
              {/* Number */}
              <div className="stat-number text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent mb-2 group-hover:from-[#0db2f3]/80 group-hover:to-blue-400 transition-all duration-300">
                {stat.number}
              </div>
              
              {/* Label */}
              <div className="font-semibold text-white dark:text-white light:text-gray-900 text-xs md:text-sm lg:text-base group-hover:text-[#0db2f3] transition-colors duration-300">
                {stat.label}
              </div>
              
              {/* Sublabel */}
              <div className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-600 mt-1 group-hover:text-gray-200 dark:group-hover:text-gray-200 light:group-hover:text-gray-700 transition-colors duration-300">
                {stat.sublabel}
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0db2f3]/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
