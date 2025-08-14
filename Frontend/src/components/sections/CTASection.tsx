import { Play, ArrowRight } from "lucide-react";
import { useRef } from "react";

export default function CTASection() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#0e0f16] via-[#0e0f16]/95 to-[#0e0f16] dark:from-[#0e0f16] dark:via-[#0e0f16]/95 dark:to-[#0e0f16] light:from-white light:via-gray-50 light:to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/10 via-transparent to-blue-500/10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0db2f3]/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div 
          ref={cardRef}
          className="relative bg-gradient-to-r from-[#0db2f3]/10 via-blue-500/10 to-[#0db2f3]/10 p-6 md:p-8 lg:p-16 text-center rounded-3xl border border-[#0db2f3]/30 backdrop-blur-sm hover:border-[#0db2f3]/50 transition-all duration-500 shadow-xl shadow-[#0db2f3]/20 hover:shadow-2xl hover:shadow-[#0db2f3]/30"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0db2f3]/5 via-blue-500/5 to-[#0db2f3]/5 blur-3xl rounded-3xl animate-pulse"></div>
          
          {/* Moving gradient overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-[#0db2f3]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
          
          <div ref={contentRef} className="relative">
            <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 md:mb-6">
              Ready to transform your{" "}
              <span className="bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
                voice?
              </span>
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians using ToriType for accurate,
              culturally-aware transcription. Start your free trial today.
            </p>
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0db2f3] to-blue-500 px-6 md:px-8 py-3 md:py-4 font-semibold text-white shadow-lg shadow-[#0db2f3]/30 hover:shadow-xl hover:shadow-[#0db2f3]/40 transition-all duration-300 overflow-hidden">
                {/* Rotating border effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0db2f3] via-blue-400 to-[#0db2f3] opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ animation: 'spin 3s linear infinite' }}></div>
                <Play className="w-4 md:w-5 h-4 md:h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Start free trial</span>
              </button>
              <button className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 font-semibold text-white dark:text-white light:text-gray-900 border border-[#0db2f3]/30 rounded-full hover:bg-[#0db2f3]/10 hover:border-[#0db2f3]/50 transition-all duration-300">
                <span className="group-hover:text-[#0db2f3] transition-colors duration-300">See how it works</span>
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 group-hover:text-[#0db2f3] transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
